import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateClient } from '@aws-amplify/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCaption 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowLeft, 
  Share2, 
  BookOpen, 
  Bookmark, 
  FileText,
  BarChart,
  ChevronDown,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Sidebar from "./Sidebar";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import juzData from '../../juzData.json'
import surahsData from '../../surahs.json';

const client = generateClient();

// Constants to help with UI calculations
const TOTAL_SURAHS = 114;
const TOTAL_JUZ = 30;

const GroupDetail = () => {
  const groupId  = "7a135d87-14d0-43b9-9892-629d387a6d8f";
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
        const usersIdnumber = localStorage.getItem('userId');
        setCurrentUser(usersIdnumber);
        
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
              
              // Get progress history for this user
              let progressHistory = [];
              try {
                const historyResponse = await client.graphql({
                  query: queries.listProgressHistories,
                  variables: { 
                    filter: { userId: { eq: userData.id } },
                    limit: 10 
                  }
                });
                
                progressHistory = historyResponse.data.listProgressHistories.items || [];
              } catch (histErr) {
                console.error('Error fetching progress history:', histErr);
              }
              
              return {
                ...userData,
                progress,
                progressHistory,
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
  
  // Helper to calculate percentage of surahs completed
  const calculateSurahProgress = (progress) => {
    if (!progress) return 0;
    
    // For completed surahs + current position calculation
    let completedCount = 0;
    if (progress.completedSurahs) {
      completedCount = progress.completedSurahs.length || 0;
    }
    
    // Also consider current position
    const currentPosition = progress.currentSurah / TOTAL_SURAHS * 100;
    
    return Math.min(Math.round((completedCount / TOTAL_SURAHS) * 100), 100);
  };
  
  // Helper to calculate percentage of juz completed
  const calculateJuzProgress = (progress) => {
    if (!progress) return 0;
    
    let completedCount = 0;
    if (progress.completedJuzs) {
      completedCount = progress.completedJuzs.length || 0;
    }
    
    // Also consider current position
    const currentPosition = progress.currentJuz / TOTAL_JUZ * 100;
    
    return Math.min(Math.round((completedCount / TOTAL_JUZ) * 100), 100);
  };
  
  // Format completed surahs as a readable string
  const formatCompletedSurahs = (progress) => {
    if (!progress || !progress.completedSurahs || progress.completedSurahs.length === 0) {
      return "None";
    }
    
    // If array of numbers, sort and format
    const completedArray = typeof progress.completedSurahs === 'string' 
      ? JSON.parse(progress.completedSurahs) 
      : progress.completedSurahs;
    
    if (completedArray.length === 0) return "None";
    
    if (completedArray.length > 5) {
      return `${completedArray.slice(0, 5).join(', ')} and ${completedArray.length - 5} more`;
    }
    
    return completedArray.join(', ');
  };
  
  // Format completed Juz as a readable string
  const formatCompletedJuzs = (progress) => {
    if (!progress || !progress.completedJuzs || progress.completedJuzs.length === 0) {
      return "None";
    }
    
    // If array of numbers, sort and format
    const completedArray = typeof progress.completedJuzs === 'string' 
      ? JSON.parse(progress.completedJuzs) 
      : progress.completedJuzs;
    
    if (completedArray.length === 0) return "None";
    
    if (completedArray.length > 5) {
      return `${completedArray.slice(0, 5).join(', ')} and ${completedArray.length - 5} more`;
    }
    
    return completedArray.join(', ');
  };
  
  // Get Surah name by number
  const getSurahName = (surahNumber) => {
    const surah = surahsData.find(s => s.number === surahNumber);
    return surah ? `${surah.nameEnglish} (${surah.nameArabic})` : `Surah ${surahNumber}`;
  };
  
  // Get Juz name by number
  const getJuzName = (juzNumber) => {
    const juz = juzData.find(j => j.number === juzNumber);
    return juz ? `${juz.name}` : `Juz ${juzNumber}`;
  };
  
  // Get current Juz location details
  const getJuzLocationDetails = (juzNumber) => {
    const juz = juzData.find(j => j.number === juzNumber);
    if (!juz) return `Juz ${juzNumber}`;
    
    const startSurahName = getSurahName(juz.startSurah).split(' ')[0];
    const endSurahName = getSurahName(juz.endSurah).split(' ')[0];
    
    if (juz.startSurah === juz.endSurah) {
      return `${startSurahName}: ${juz.startAyah}-${juz.endAyah}`;
    }
    
    return `${startSurahName} ${juz.startAyah} - ${endSurahName} ${juz.endAyah}`;
  };
  
  // Get reading streak (consecutive days with progress)
  const calculateReadingStreak = (progressHistory) => {
    if (!progressHistory || progressHistory.length === 0) return 0;
    
    // Sort by date
    const sortedHistory = [...progressHistory].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Group by day
    const dayEntries = {};
    sortedHistory.forEach(entry => {
      const date = new Date(entry.createdAt).toISOString().split('T')[0];
      if (!dayEntries[date]) {
        dayEntries[date] = true;
      }
    });
    
    // Get days as array
    const days = Object.keys(dayEntries).sort().reverse();
    
    // Check for streak (consecutive days)
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const prevDay = new Date(days[i-1]);
      const currDay = new Date(days[i]);
      
      // Get difference in days
      const diffTime = Math.abs(prevDay - currDay);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Calculate reading pace (average ayahs per day over last 7 days)
  const calculateReadingPace = (progressHistory) => {
    if (!progressHistory || progressHistory.length === 0) return 0;
    
    // Get entries from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = progressHistory.filter(
      entry => new Date(entry.createdAt) >= oneWeekAgo
    );
    
    if (recentEntries.length === 0) return 0;
    
    // Calculate total ayahs read in period
    let totalAyahs = 0;
    recentEntries.forEach(entry => {
      if (entry.ayahsRead) {
        totalAyahs += entry.ayahsRead;
      }
    });
    
    // Return average per day
    return Math.round(totalAyahs / 7);
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
        <Button onClick={() => navigate("/groups")}>
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
        
        {/* Group info card with tabs */}
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
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">
                    <FileText size={16} className="mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="surahs">
                    <BookOpen size={16} className="mr-2" />
                    Surah Progress
                  </TabsTrigger>
                  <TabsTrigger value="juz">
                    <Bookmark size={16} className="mr-2" />
                    Juz Progress
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                    <BarChart size={16} className="mr-2" />
                    Statistics
                  </TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Member Since</TableHead>
                        <TableHead>Current Position</TableHead>
                        <TableHead>Total Read</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.memberSince}</TableCell>
                          <TableCell>
                            {member.progress ? (
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <BookOpen size={16} className="mr-2 text-blue-500" />
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help border-b border-dotted border-gray-400">
                                          {getSurahName(member.progress.currentSurah).split(' ')[0]}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">{getSurahName(member.progress.currentSurah)}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <span>, Ayah {member.progress.currentAyah}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Bookmark size={14} className="mr-2 text-green-500" />
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help border-b border-dotted border-gray-400">
                                          Juz {member.progress.currentJuz}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">{getJuzName(member.progress.currentJuz)}</p>
                                        <p className="text-xs">{getJuzLocationDetails(member.progress.currentJuz)}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            ) : (
                              "No progress recorded"
                            )}
                          </TableCell>
                          <TableCell>
                            {member.progress ? (
                              <Badge variant="outline" className="font-medium">
                                {member.progress.totalAyahsRead || 0} Ayahs
                              </Badge>
                            ) : (
                              "0 Ayahs"
                            )}
                          </TableCell>
                          <TableCell>
                            {member.progress && member.progress.lastUpdated ? (
                              <div className="flex flex-col">
                                <span>{new Date(member.progress.lastUpdated).toLocaleDateString()}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(member.progress.lastUpdated).toLocaleTimeString()}
                                </span>
                              </div>
                            ) : (
                              "Never"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                {/* Surah Progress Tab */}
                <TabsContent value="surahs">
                  <Table>
                    <TableCaption>Detailed Surah progress for each member</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Surah</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Completed Surahs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>
                            {member.progress ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help flex items-center">
                                      <span>{getSurahName(member.progress.currentSurah)}</span>
                                      <Info size={14} className="ml-1 text-gray-400" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Surah {member.progress.currentSurah}: 
                                      Ayah {member.progress.currentAyah}
                                    </p>
                                    {surahsData.find(s => s.number === member.progress.currentSurah) && (
                                      <p className="text-xs text-gray-400">
                                        Total verses: {surahsData.find(s => s.number === member.progress.currentSurah).verseCount}
                                      </p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              "Not started"
                            )}
                          </TableCell>
                          <TableCell className="w-64">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Surah Progress</span>
                                <span>{calculateSurahProgress(member.progress)}%</span>
                              </div>
                              <Progress 
                                value={calculateSurahProgress(member.progress)} 
                                className="h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {member.progress && member.progress.completedSurahs && 
                             (typeof member.progress.completedSurahs === 'string' ? 
                               JSON.parse(member.progress.completedSurahs).length : 
                               member.progress.completedSurahs.length) > 0 ? (
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="completed-surahs">
                                  <AccordionTrigger className="text-sm py-1">
                                    Show {(typeof member.progress.completedSurahs === 'string' ? 
                                      JSON.parse(member.progress.completedSurahs).length : 
                                      member.progress.completedSurahs.length)} completed surahs
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {(typeof member.progress.completedSurahs === 'string' ? 
                                        JSON.parse(member.progress.completedSurahs) : 
                                        member.progress.completedSurahs).map(surahNum => (
                                        <div key={`surah-${surahNum}`} className="flex items-center">
                                          <Badge variant="outline" className="mr-2">{surahNum}</Badge>
                                          {getSurahName(surahNum).split(' ')[0]}
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ) : (
                              <div className="text-gray-500">None completed yet</div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                {/* Juz Progress Tab */}
                <TabsContent value="juz">
                  <Table>
                    <TableCaption>Detailed Juz progress for each member</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Juz</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Completed Juz</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>
                            {member.progress ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help flex items-center">
                                      <span>Juz {member.progress.currentJuz} ({getJuzName(member.progress.currentJuz)})</span>
                                      <Info size={14} className="ml-1 text-gray-400" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      {getJuzLocationDetails(member.progress.currentJuz)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              "Not started"
                            )}
                          </TableCell>
                          <TableCell className="w-64">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Juz Progress</span>
                                <span>{calculateJuzProgress(member.progress)}%</span>
                              </div>
                              <Progress 
                                value={calculateJuzProgress(member.progress)} 
                                className="h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {member.progress && member.progress.completedJuzs && 
                             (typeof member.progress.completedJuzs === 'string' ? 
                              JSON.parse(member.progress.completedJuzs).length : 
                              member.progress.completedJuzs.length) > 0 ? (
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="completed-juzs">
                                  <AccordionTrigger className="text-sm py-1">
                                    Show {(typeof member.progress.completedJuzs === 'string' ? 
                                      JSON.parse(member.progress.completedJuzs).length : 
                                      member.progress.completedJuzs.length)} completed juz
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {(typeof member.progress.completedJuzs === 'string' ? 
                                        JSON.parse(member.progress.completedJuzs) : 
                                        member.progress.completedJuzs).map(juzNum => (
                                        <div key={`juz-${juzNum}`} className="flex items-center">
                                          <Badge variant="outline" className="mr-2">{juzNum}</Badge>
                                          {getJuzName(juzNum)}
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ) : (
                              <div className="text-gray-500">None completed yet</div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                {/* Statistics Tab */}
                <TabsContent value="stats">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50">
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>
                            {member.progress ? (
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <BookOpen size={14} className="mr-1 text-blue-500" />
                                  <span>{getSurahName(member.progress.currentSurah)}, </span>
                                  <span className="ml-1">Ayah {member.progress.currentAyah}</span>
                                </div>
                                <div className="flex items-center">
                                  <Bookmark size={14} className="mr-1 text-green-500" />
                                  <span>Juz {member.progress.currentJuz} ({getJuzName(member.progress.currentJuz)})</span>
                                </div>
                              </div>
                            ) : (
                              "No progress recorded"
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {member.progress ? (
                            <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Reading Streak</span>
          <Badge variant="outline" className="bg-amber-50">
            {calculateReadingStreak(member.progressHistory)} days
          </Badge>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Reading Pace</span>
          <Badge variant="outline" className="bg-blue-50">
            {calculateReadingPace(member.progressHistory)} ayahs/day
          </Badge>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Total Read</span>
          <Badge variant="outline" className="bg-green-50">
            {member.progress.totalAyahsRead || 0} ayahs
          </Badge>
        </div>
      </div>
                              
      <div>
        <h4 className="text-sm font-medium mb-2">Surah Progress</h4>
        <div className="flex justify-between text-xs mb-1">
          <span>Completed: {
            typeof member.progress.completedSurahs === 'string' ? 
            JSON.parse(member.progress.completedSurahs).length : 
            (member.progress.completedSurahs?.length || 0)
          } of {TOTAL_SURAHS}</span>
          <span>{calculateSurahProgress(member.progress)}%</span>
        </div>
        <Progress 
          value={calculateSurahProgress(member.progress)} 
          className="h-2 mb-4"
        />
      </div>
                              
      <div>
        <h4 className="text-sm font-medium mb-2">Juz Progress</h4>
        <div className="flex justify-between text-xs mb-1">
          <span>Completed: {
            typeof member.progress.completedJuzs === 'string' ?
            JSON.parse(member.progress.completedJuzs).length :
            (member.progress.completedJuzs?.length || 0)
          } of {TOTAL_JUZ}</span>
          <span>{calculateJuzProgress(member.progress)}%</span>
        </div>
        <Progress 
          value={calculateJuzProgress(member.progress)} 
          className="h-2"
        />
      </div>
                              
      <div>
        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
        {member.progressHistory && member.progressHistory.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
            {member.progressHistory
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((entry, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    <Badge variant="outline">{entry.ayahsRead || 0} ayahs</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.surahRead && entry.ayahStart && entry.ayahEnd ? (
                      <span>Read {getSurahName(entry.surahRead).split(' ')[0]} {entry.ayahStart}-{entry.ayahEnd}</span>
                    ) : (
                      <span>Progress updated</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No recent activity</div>
        )}
      </div>
    </div>
                                ) : (
                                  <div className="text-center py-6 text-gray-500">
                                    <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
                                    <p>No reading progress recorded yet</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-8">
                      <Users size={32} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No members in this group yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Group Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Information</CardTitle>
                    <CardDescription>Details about this reading group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Group Name</h3>
                        <p>{group.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <p>{group.description || "No description provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                        <p>{new Date(group.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Group Code</h3>
                        <p className="font-mono bg-gray-100 p-2 rounded">{group.code}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Privacy</h3>
                        <Badge variant={group.isPublic ? "outline" : "secondary"}>
                          {group.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Group Leaderboard</CardTitle>
                    <CardDescription>Top readers in this group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {members.length > 0 ? (
                      <div className="space-y-4">
                        {/* Sort members by total ayahs read */}
                        {[...members]
                          .sort((a, b) => (
                            (b.progress?.totalAyahsRead || 0) - (a.progress?.totalAyahsRead || 0)
                          ))
                          .slice(0, 5)
                          .map((member, index) => (
                            <div key={member.id} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                                ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                  index === 1 ? 'bg-gray-100 text-gray-700' : 
                                    index === 2 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{member.name}</h3>
                                  <Badge variant="outline">
                                    {member.progress?.totalAyahsRead || 0} ayahs
                                  </Badge>
                                </div>
                                <Progress 
                                  value={member.progress?.totalAyahsRead ? 
                                    Math.min(100, (member.progress.totalAyahsRead / 6236) * 100) : 0} 
                                  className="h-1 mt-1"
                                />
                              </div>
                            </div>
                          ))
                        }
                        
                        <div className="pt-4 border-t mt-4">
                          <h3 className="text-sm font-medium mb-2">Most Consistent Reader</h3>
                          {(() => {
                            // Find member with highest streak
                            const topStreakMember = [...members].sort((a, b) => 
                              calculateReadingStreak(b.progressHistory) - calculateReadingStreak(a.progressHistory)
                            )[0];
                            
                            return topStreakMember && calculateReadingStreak(topStreakMember.progressHistory) > 0 ? (
                              <div className="flex justify-between items-center">
                                <span>{topStreakMember.name}</span>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                  {calculateReadingStreak(topStreakMember.progressHistory)} day streak
                                </Badge>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No reading streaks yet</p>
                            );
                          })()}
                        </div>
                        
                        <div className="pt-4 border-t mt-4">
                          <h3 className="text-sm font-medium mb-2">Fastest Reader</h3>
                          {(() => {
                            // Find member with highest pace
                            const topPaceMember = [...members].sort((a, b) => 
                              calculateReadingPace(b.progressHistory) - calculateReadingPace(a.progressHistory)
                            )[0];
                            
                            return topPaceMember && calculateReadingPace(topPaceMember.progressHistory) > 0 ? (
                              <div className="flex justify-between items-center">
                                <span>{topPaceMember.name}</span>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {calculateReadingPace(topPaceMember.progressHistory)} ayahs/day
                                </Badge>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No reading pace data yet</p>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart size={32} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No members to show on leaderboard</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    };

    export default GroupDetail;