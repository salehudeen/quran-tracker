import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateClient } from '@aws-amplify/api';
import { getCurrentUser } from "@aws-amplify/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Users, ArrowLeft, Share2, UserPlus } from "lucide-react";
import Sidebar from "./Sidebar";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

const GroupDetail = () => {
  const groupId  = "7a135d87-14d0-43b9-9892-629d387a6d8f"
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        // const userData = await getCurrentUser();
        const usersIdnumber = localStorage.getItem('userId');
        setCurrentUser(usersIdnumber);
        console.log(currentUser)
        // Fetch group data
        const groupResponse = await client.graphql({
          query: queries.getGroup,
          variables: { id: groupId }
        });
        
        const groupData = groupResponse.data.getGroup;
        setGroup(groupData);
        
        // Fetch group members
        const membersResponse = await client.graphql({
          query: queries.groupMembersByGroupId,
          variables: { groupId: groupId }
        });
        
        const memberItems = membersResponse.data.groupMembersByGroupId.items;
        
        // Check if current user is a member
        const userMembership = memberItems.find(m => m.userId === "c24504a4-7051-705f-8342-7c376cb7bc77");
        setIsMember(!!userMembership);
        
        // For simplicity, assuming the first member is the admin/creator
        // In a real app, you'd have an admin field in the database
        setIsAdmin(memberItems.length > 0 && memberItems[0].userId === "c24504a4-7051-705f-8342-7c376cb7bc77");
        
        // Fetch details for each member
        const membersWithDetails = await Promise.all(
          memberItems.map(async (member) => {
            try {
              const userResponse = await client.graphql({
                query: queries.getUser,
                variables: { id: member.userId }
              });
              
              const userData = userResponse.data.getUser;
              
              // Fetch reading progress if available
              let progress = null;
              if (userData.progress) {
                progress = userData.progress;
              } else if (userData.userProgressId) {
                const progressResponse = await client.graphql({
                  query: queries.getReadingProgress,
                  variables: { id: userData.userProgressId }
                });
                progress = progressResponse.data.getReadingProgress;
              }
              
              return {
                ...userData,
                progress,
                memberSince: new Date(member.createdAt).toLocaleDateString()
              };
            } catch (err) {
              console.error(`Error fetching user data for ${member.userId}:`, err);
              return {
                id: member.userId,
                name: "Unknown User",
                memberSince: new Date(member.createdAt).toLocaleDateString()
              };
            }
          })
        );
        
        setMembers(membersWithDetails);
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);
  
  const leaveGroup = async () => {
    try {
      // Find membership record
      const membershipResponse = await client.graphql({
        query: queries.groupMembersByUserId,
        variables: { 
          userId: currentUser,
          filter: {
            groupId: { eq: groupId }
          }
        }
      });
      
      const membership = membershipResponse.data.groupMembersByUserId.items[0];
      
      if (!membership) {
        throw new Error("Membership not found");
      }
      
      // Delete membership
      await client.graphql({
        query: mutations.deleteGroupMembers,
        variables: { 
          input: { id: membership.id }
        }
      });
      
      // Redirect to groups page
      navigate("/groups");
    } catch (err) {
      console.error('Error leaving group:', err);
      setError(err.message);
    }
  };
  
  const copyInviteInfo = () => {
    const inviteText = `Join my reading group "${group.name}"! Group ID: ${group.id}, Code: ${group.code}`;
    navigator.clipboard.writeText(inviteText)
      .then(() => {
        alert("Invite information copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert(`Group ID: ${group.id}, Code: ${group.code}`);
      });
  };
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Loading group details...</p>
    </div>;
  }
  
  if (error) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => navigate("/group")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Groups
        </Button>
      </div>
    </div>;
  }
  
  if (!group) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4">Group not found</p>
        <Button onClick={() => navigate("/groups")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Groups
        </Button>
      </div>
    </div>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/groups")} className="mr-4">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              <p className="text-gray-600">Group ID: {group.id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isMember && (
              <>
                <Button variant="outline" onClick={copyInviteInfo}>
                  <Share2 size={16} className="mr-2" />
                  Share Invite
                </Button>
                <Button variant="destructive" onClick={leaveGroup}>
                  Leave Group
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Group info card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Group Members ({members.length})
            </CardTitle>
            <CardDescription>
              {isMember ? 
                "You are a member of this group" : 
                "You are viewing this group as a guest"
              }
              {isAdmin && " (You are the group admin)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Current Position</TableHead>
                    <TableHead>Total Read</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.memberSince}</TableCell>
                      <TableCell>
                        {member.progress ? (
                          <>Surah {member.progress.currentSurah}, Ayah {member.progress.currentAyah}</>
                        ) : (
                          "No progress recorded"
                        )}
                      </TableCell>
                      <TableCell>
                        {member.progress ? (
                          <>{member.progress.totalAyahsRead || 0} Ayahs</>
                        ) : (
                          "0 Ayahs"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No members in this group yet.</p>
            )}
            
            {group.code && isAdmin && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Group Invite Information</h3>
                <p className="text-sm text-blue-700">Share these details with others to invite them to your group:</p>
                <div className="mt-2 p-3 bg-white rounded border border-blue-200">
                  <p><strong>Group ID:</strong> {group.id}</p>
                  <p><strong>Invite Code:</strong> {group.code}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyInviteInfo}
                  className="mt-3"
                >
                  <Share2 size={14} className="mr-2" />
                  Copy Invite Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Group activity could be added here in a future iteration */}
      </div>
    </div>
  );
};

export default GroupDetail;