import { useState, useEffect } from "react";
import { generateClient } from '@aws-amplify/api';
import { getCurrentUser } from "@aws-amplify/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, PlusCircle, LogIn } from "lucide-react";
import Sidebar from "./Sidebar";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

const GroupsPage = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [newGroupName, setNewGroupName] = useState("");
  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersIdnumber = localStorage.getItem('userId');
        // const currentUser = await getCurrentUser();
        // console.log("current user", currentUser)
        const userId = usersIdnumber;
        setUserId(userId);
        
        if (!userId) {
          throw new Error('No user ID found');
        }

        // Fetch user data
        const response = await client.graphql({
          query: queries.getUser,
          variables: { id: userId }
        });
        
        const user = response.data.getUser;
        setUserData(user);
        
        // Fetch user's groups
        if (user.groups && user.groups.items) {
          setUserGroups(user.groups.items);
        } else {
          // If groups not included in user data, fetch them separately
          const groupMembersResponse = await client.graphql({
            query: queries.groupMembersByUserId,
            variables: { userId: userId }
          });
          
          const groupMembers = groupMembersResponse.data.groupMembersByUserId.items;
          
          // Fetch full group details for each membership
          const groups = await Promise.all(
            groupMembers.map(async (member) => {
              const groupResponse = await client.graphql({
                query: queries.getGroup,
                variables: { id: member.groupId }
              });
              return groupResponse.data.getGroup;
            })
          );
          
          setUserGroups(groups);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const createNewGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    
    try {
      setLoading(true);
      
      // Generate a random 6-digit code
      const groupCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create new group
      const createGroupResponse = await client.graphql({
        query: mutations.createGroup,
        variables: { 
          input: { 
            name: newGroupName,
            code: groupCode
          } 
        }
      });
      
      const newGroup = createGroupResponse.data.createGroup;
      
      // Add current user as a member
      await client.graphql({
        query: mutations.createGroupMembers,
        variables: { 
          input: { 
            userId: userId,
            groupId: newGroup.id
          } 
        }
      });
      
      // Update local state
      setUserGroups([...userGroups, newGroup]);
      setNewGroupName("");
      setSuccessMessage(`Group "${newGroupName}" created successfully! Group code: ${groupCode}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const joinExistingGroup = async () => {
    if (!joinGroupId.trim() || !joinGroupCode.trim()) {
      setError("Please enter both group ID and code");
      return;
    }
    
    try {
      setLoading(true);
      
      // Verify group exists and code matches
      const groupResponse = await client.graphql({
        query: queries.getGroup,
        variables: { id: joinGroupId }
      });
      
      const group = groupResponse.data.getGroup;
      
      if (!group) {
        throw new Error("Group not found");
      }
      
      if (group.code !== joinGroupCode) {
        throw new Error("Invalid group code");
      }
      
      // Check if user is already a member
      const membershipCheck = await client.graphql({
        query: queries.groupMembersByUserId,
        variables: { 
          userId: userId,
          filter: {
            groupId: { eq: joinGroupId }
          }
        }
      });
      
      if (membershipCheck.data.groupMembersByUserId.items.length > 0) {
        throw new Error("You are already a member of this group");
      }
      
      // Add user to group
      await client.graphql({
        query: mutations.createGroupMembers,
        variables: { 
          input: { 
            userId: userId,
            groupId: joinGroupId
          } 
        }
      });
      
      // Update local state
      setUserGroups([...userGroups, group]);
      setJoinGroupId("");
      setJoinGroupCode("");
      setSuccessMessage(`Successfully joined "${group.name}"!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !userData) {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Loading your groups...</p>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reading Groups
          </h1>
          <p className="text-gray-600 mt-2">Join or create reading groups to connect with others</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage("")}>
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        {/* Groups and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Groups */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">My Groups</CardTitle>
              <Users size={20} className="text-gray-600" />
            </CardHeader>
            <CardContent>
              {userGroups.length > 0 ? (
                <ul className="space-y-3">
                  {userGroups.map((group) => (
                    <li
                      key={group.id}
                      className="p-3 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-200 transition"
                    >
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-gray-500">ID: {group.id}</p>
                      </div>
                      <Button variant="outline" size="sm"
                        
                      >
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">You haven't joined any groups yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Create/Join Group */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="create" className="flex-1">Create Group</TabsTrigger>
                  <TabsTrigger value="join" className="flex-1">Join Group</TabsTrigger>
                </TabsList>
                
                {/* Create Group Tab */}
                <TabsContent value="create">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input 
                        id="group-name" 
                        placeholder="Enter group name" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={createNewGroup}
                      disabled={loading || !newGroupName.trim()}
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Create New Group
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Join Group Tab */}
                <TabsContent value="join">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="group-id">Group ID</Label>
                      <Input 
                        id="group-id" 
                        placeholder="Enter group ID" 
                        value={joinGroupId}
                        onChange={(e) => setJoinGroupId(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-code">Group Code</Label>
                      <Input 
                        id="group-code" 
                        placeholder="Enter 6-digit group code" 
                        value={joinGroupCode}
                        onChange={(e) => setJoinGroupCode(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={joinExistingGroup}
                      disabled={loading || !joinGroupId.trim() || !joinGroupCode.trim()}
                    >
                      <LogIn size={16} className="mr-2" />
                      Join Group
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;