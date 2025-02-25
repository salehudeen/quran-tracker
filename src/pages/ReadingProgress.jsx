import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Save, RotateCcw, ChevronDown, CheckCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import surahs from '../../surahs.json';
import juzData from '../../juzData.json';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { getCurrentUser } from "@aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
// import { v4 } from "uuid";

const ReadingProgress = ({ userId, client }) => {
  // Calculate Hizb data from juzData
  const generateHizbData = () => {
    const hizbArray = [];
    
    juzData.forEach(juz => {
      // Each juz has 2 hizbs, each with 4 quarters
      const hizbQuarters = [...juz.quarters];
      
      // First hizb (quarters 1-2)
      hizbArray.push({
        number: (juz.number - 1) * 2 + 1,
        name: `${juz.name} - First Half`,
        startSurah: hizbQuarters[0].surah,
        startAyah: hizbQuarters[0].ayah,
        endSurah: hizbQuarters[1].surah,
        endAyah: hizbQuarters[1].ayah,
        quarters: hizbQuarters.slice(0, 2)
      });
      
      // Second hizb (quarters 3-4)
      hizbArray.push({
        number: (juz.number - 1) * 2 + 2,
        name: `${juz.name} - Second Half`,
        startSurah: hizbQuarters[2].surah,
        startAyah: hizbQuarters[2].ayah,
        endSurah: juz.endSurah,
        endAyah: juz.endAyah,
        quarters: hizbQuarters.slice(2, 4)
      });
    });
    
    return hizbArray;
  };

  const hizbData = generateHizbData();
  
  const [session, setSession] = useState({
    currentSurah: 1,
    currentAyah: 1,
    currentJuz: 1,
    completedSurahs: [],
    totalAyahsRead: 0,
    completedJuzs: [],
    completedHizb: []
  });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSurahList, setShowSurahList] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentJuz, setCurrentJuz] = useState(1);
  const [currentHizb, setCurrentHizb] = useState(1);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [ayahOptions, setAyahOptions] = useState([]);
  const [saveStatus, setSaveStatus] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);

  // Calculate total Ayahs in Quran
  const TOTAL_AYAHS = surahs.reduce((total, surah) => total + surah.verseCount, 0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const client = generateClient();
        const idUser = await getCurrentUser();
        const userId = idUser.userId;
        setLoading(true);
        if (client && userId) {
          // Use the proper query for getting reading progress
          console.log(' data found')
          const response = await client.graphql({
            query: queries.getReadingProgress,
            variables: { id: userId }
          });
          console.log("gotten reading progress",response)
          if (response.data?.getReadingProgress) {
            
            setSession(response.data.getReadingProgress);
            setHasExistingData(true);
          } else {
            console.log('no data found')
            // No existing data found
            setHasExistingData(false);
            setSession({
              currentSurah: 2,
              currentAyah: 286,
              currentJuz: 1,
              completedSurahs: [],
              completedJuzs: [],
              completedHizb: [],
              totalAyahsRead: 0
            });
          }
        } else {
          console.log("nothing found")
          setTimeout(() => {
            setSession({
              currentSurah: 1,
              currentAyah: 1,
              currentJuz: 1,
              completedSurahs: [],
              completedJuzs: [],
              completedHizb: [],
              totalAyahsRead: 0
            });
          }, 500);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchProgress();
  }, [userId, client]);

  // Update ayah options when surah changes
  useEffect(() => {
    const currentSurahData = surahs.find(s => s.number === session.currentSurah);
    if (currentSurahData) {
      const options = Array.from({ length: currentSurahData.verseCount }, (_, i) => i + 1);
      setAyahOptions(options);
    }
  }, [session.currentSurah]);

  // Calculate overall progress
  useEffect(() => {
    const progress = Math.round((session.totalAyahsRead / TOTAL_AYAHS) * 100);
    if (progress == null) 
    {
      setOverallProgress(0);
    }
    else
    {
      setOverallProgress(progress);
    }
    
    // Determine current Juz, Hizb and Quarter
    calculateReadingPosition();
  }, [session.currentSurah, session.currentAyah, session.totalAyahsRead]);

  const isPositionWithinBounds = (surah, ayah, startSurah, startAyah, endSurah, endAyah) => {
    if (surah < startSurah || (surah === startSurah && ayah < startAyah)) {
      return false;
    }
    if (surah > endSurah || (surah === endSurah && ayah > endAyah)) {
      return false;
    }
    return true;
  };

  const calculateReadingPosition = () => {
    // Find current Juz
    for (const juz of juzData) {
      if (isPositionWithinBounds(
        session.currentSurah, 
        session.currentAyah, 
        juz.startSurah, 
        juz.startAyah, 
        juz.endSurah, 
        juz.endAyah
      )) {
        setCurrentJuz(juz.number);
        
        // Find current quarter within this juz
        for (let i = 0; i < juz.quarters.length; i++) {
          const currentQuarter = juz.quarters[i];
          const nextQuarter = i < juz.quarters.length - 1 ? juz.quarters[i + 1] : 
            { surah: juz.endSurah, ayah: juz.endAyah + 1 };
          
          if (isPositionWithinBounds(
            session.currentSurah,
            session.currentAyah,
            currentQuarter.surah,
            currentQuarter.ayah,
            nextQuarter.surah,
            nextQuarter.ayah - 1
          )) {
            setCurrentQuarter(i + 1);
            break;
          }
        }
        break;
      }
    }
    
    // Find current Hizb
    for (const hizb of hizbData) {
      if (isPositionWithinBounds(
        session.currentSurah,
        session.currentAyah,
        hizb.startSurah,
        hizb.startAyah,
        hizb.endSurah,
        hizb.endAyah
      )) {
        setCurrentHizb(hizb.number);
        break;
      }
    }
  };

  const getNextPositionAfterAyah = (surah, ayah) => {
    const currentSurahData = surahs.find(s => s.number === surah);
    
    if (!currentSurahData) return { surah: 1, ayah: 1 };
    
    // If we're at the last ayah of the surah
    if (ayah >= currentSurahData.verseCount) {
      // If we're at the last surah
      if (surah >= surahs.length) {
        return { surah, ayah }; // Stay at the same position (end of Quran)
      }
      // Move to the first ayah of the next surah
      return { surah: surah + 1, ayah: 1 };
    }
    
    // Move to the next ayah in the current surah
    return { surah, ayah: ayah + 1 };
  };

  const calculateTotalAyahsRead = (surah, ayah) => {
    let total = 0;
    
    // Add full completed surahs
    for (const completedSurah of session.completedSurahs) {
      const surahData = surahs.find(s => s.number === completedSurah);
      if (surahData) {
        total += surahData.verseCount;
      }
    }
    
    // Add current surah's read ayahs
    if (!session.completedSurahs.includes(surah)) {
      total += ayah - 1; // -1 because current ayah is not yet read
    }
    
    return total;
  };

  const isSurahCompleted = (surahNumber) => {
    return session.completedSurahs.includes(surahNumber);
  };

  const handleSurahChange = (surahNumber) => {
    if (!isSurahCompleted(surahNumber)) {
      setSession(prev => ({ 
        ...prev, 
        currentSurah: surahNumber,
        currentAyah: 1 
      }));
      setShowSurahList(false);
    }
  };

  const handleAyahChange = (ayahNumber) => {
    setSession(prev => ({ ...prev, currentAyah: ayahNumber }));
  };

  const markCurrentAyahAsRead = () => {
    const currentSurahData = surahs.find(s => s.number === session.currentSurah);
    
    if (!currentSurahData) return;
    
    let newSession = { ...session };
    
    // Check if we're completing a surah
    const isCompletingSurah = session.currentAyah === currentSurahData.verseCount && 
                            !session.completedSurahs.includes(session.currentSurah);
    
    if (isCompletingSurah) {
      newSession.completedSurahs = [...session.completedSurahs, session.currentSurah];
    }
    
    // Get next position
    const nextPosition = getNextPositionAfterAyah(session.currentSurah, session.currentAyah);
    newSession.currentSurah = nextPosition.surah;
    newSession.currentAyah = nextPosition.ayah;
    
    // Check for completed juz
    juzData.forEach(juz => {
      // If we just read the last ayah of a juz
      if (
        session.currentSurah === juz.endSurah && 
        session.currentAyah === juz.endAyah &&
        !session.completedJuzs.includes(juz.number)
      ) {
        newSession.completedJuzs = [...(newSession.completedJuzs || []), juz.number];
      }
    });
    
    // Check for completed hizb
    hizbData.forEach(hizb => {
      if (
        session.currentSurah === hizb.endSurah && 
        session.currentAyah === hizb.endAyah &&
        !session.completedHizb.includes(hizb.number)
      ) {
        newSession.completedHizb = [...(newSession.completedHizb || []), hizb.number];
      }
    });
    
    // Update current Juz value for database
    newSession.currentJuz = currentJuz;
    
    // Increment total ayahs read
    newSession.totalAyahsRead = session.totalAyahsRead + 1;
    
    setSession(newSession);
  };

  const saveProgress = async () => {
    try {
      const client = generateClient();
      const idUser = await getCurrentUser();
      const userId = idUser.userId;
      setSaveStatus("Saving...");
      console.log("Starting save operation with client and userId:", !!client, userId);
      
      if (!client || !userId) {
        console.error("Missing client or userId for saving progress");
        setSaveStatus("Save failed: Missing client or userId");
        return;
      }
      
      // Create an input object that matches your backend schema
      // Remove completedHizb field since it's not in the schema
      const input = {
        id: userId, 
        userId: userId,
        currentSurah: session.currentSurah,
        currentAyah: session.currentAyah,
        currentJuz: currentJuz,
        completedSurahs: session.completedSurahs || [],
        completedJuzs: session.completedJuzs || [],
        totalAyahsRead: session.totalAyahsRead,
        lastUpdated: new Date().toISOString()
      };
      
      console.log("Saving progress with data:", JSON.stringify(input, null, 2));
  
      // Determine whether to create or update based on whether data exists
      let result;
      if (hasExistingData) {
        console.log("Updating existing reading progress");
        result = await client.graphql({
          query: mutations.updateReadingProgress,
          variables: { input }
        });
      } else {
        console.log("Creating new reading progress");
        result = await client.graphql({
          query: mutations.createReadingProgress,
          variables: { input }
        });
        setHasExistingData(true);
      }
      
      console.log("Save result:", result);
      
      // Check if we should also update progress history
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
      
      // Create progress history record for today
      const historyInput = {
        id: userId, // Create a composite ID
        userId: userId,
        date: today,
        surahsRead: session.completedSurahs.length,
        ayahsRead: session.totalAyahsRead,
        juzCompleted: session.completedJuzs.length
      };
      
      console.log("Saving progress history with data:", JSON.stringify(historyInput, null, 2));
      
      // Check if we already have a history record for today
      try {
        const existingHistory = await client.graphql({
          query: queries.getProgressHistory,
          variables: { id: historyInput.id }
        });
        
        console.log("Existing history check result:", existingHistory);
        
        if (existingHistory.data?.getProgressHistory) {
          // Update existing history
          console.log("Updating existing progress history");
          await client.graphql({
            query: mutations.updateProgressHistory,
            variables: { input: historyInput }
          });
        } else {
          // Create new history
          console.log("Creating new progress history");
          await client.graphql({
            query: mutations.createProgressHistory,
            variables: { input: historyInput }
          });
        }
      } catch (historyErr) {
        console.error("Error checking history:", historyErr);
        // If error fetching history, try to create a new one
        try {
          console.log("Attempting to create progress history after error");
          await client.graphql({
            query: mutations.createProgressHistory,
            variables: { input: historyInput }
          });
        } catch (createErr) {
          console.error("Error creating progress history:", createErr);
        }
      }
      
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      console.error("Error saving progress:", err);
      console.error("Error details:", err.errors || err.message || JSON.stringify(err));
      setError("Failed to save progress");
      setSaveStatus("Failed to save");
      setTimeout(() => setSaveStatus(""), 2000);
      setSaveStatus("Failed to save");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      const resetSession = {
        currentSurah: 1,
        currentAyah: 1,
        currentJuz: 1,
        completedSurahs: [],
        completedJuzs: [],
        completedHizb: [],
        totalAyahsRead: 0
      };
      
      setSession(resetSession);
      
      // Save the reset progress to backend if user confirms
      if (hasExistingData && client && userId) {
        setSaveStatus("Resetting...");
        const input = {
          id: userId,
          userId: userId,
          ...resetSession,
          lastUpdated: new Date().toISOString()
        };
        
        client.graphql({
          query: mutations.updateReadingProgress,
          variables: { input }
        }).then(() => {
          setSaveStatus("Reset successfully!");
          setTimeout(() => setSaveStatus(""), 2000);
        }).catch(err => {
          console.error("Error resetting progress:", err);
          setSaveStatus("Failed to reset");
          setTimeout(() => setSaveStatus(""), 2000);
        });
      }
    }
  };
  
  const getCurrentQuarterInfo = () => {
    const juz = juzData.find(j => j.number === currentJuz);
    if (juz && currentQuarter <= juz.quarters.length) {
      return juz.quarters[currentQuarter - 1];
    }
    return null;
  };

  if (loading) return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-lg">Loading your progress...</div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-red-500 text-center p-4">
          {error}
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const currentSurahData = surahs.find(s => s.number === session.currentSurah);
  const currentJuzData = juzData.find(j => j.number === currentJuz);
  const currentHizbData = hizbData.find(h => h.number === currentHizb);
  const quarterInfo = getCurrentQuarterInfo();

  return (
    <Card className="w-full max-w-md mx-auto">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Book className="text-green-600" />
            Quran Reading Progress
          </CardTitle>
          <div className="text-sm font-medium text-green-600">
            {session.totalAyahsRead} / {TOTAL_AYAHS} Ayahs
          </div>
        </div>
        <Progress value={overallProgress} className="h-2" />
        {hasExistingData && (
          <div className="text-xs text-gray-500 mt-1">
            Your progress is being tracked
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Current Surah</label>
            <div className="relative">
              <div 
                className="p-2 border rounded cursor-pointer flex justify-between items-center bg-white"
                onClick={() => setShowSurahList(!showSurahList)}
              >
                <span>
                  {session.currentSurah}. {currentSurahData?.nameEnglish || 'Select'}
                </span>
                <ChevronDown size={16} />
              </div>
              
              {showSurahList && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {surahs.map((surah) => (
                    <div 
                      key={surah.number} 
                      className={`p-2 cursor-pointer flex justify-between items-center ${
                        isSurahCompleted(surah.number) ? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-100'
                      } ${session.currentSurah === surah.number ? 'bg-green-50 text-green-700' : ''}`}
                      onClick={() => handleSurahChange(surah.number)}
                    >
                      <span>{surah.number}. {surah.nameEnglish} <span className="text-xs">({surah.nameArabic})</span></span>
                      {isSurahCompleted(surah.number) && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Current Ayah</label>
            <select 
              className="w-full p-2 border rounded bg-white"
              value={session.currentAyah}
              onChange={(e) => handleAyahChange(parseInt(e.target.value))}
            >
              {ayahOptions.map(ayah => (
                <option key={ayah} value={ayah}>
                  {ayah}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Juz and Hizb info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Current Juz</div>
            <div className="text-xl font-bold text-blue-900">
              {currentJuz}
              {currentJuzData && <span className="text-sm font-normal ml-2">({currentJuzData.name})</span>}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Completed: {(session.completedJuzs || []).length} of 30
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-800 font-medium">Current Hizb</div>
            <div className="text-xl font-bold text-purple-900">{currentHizb}</div>
            <div className="text-xs text-purple-700 mt-1">
              Completed: {(session.completedHizb || []).length} of 60
            </div>
          </div>
        </div>
        
        {/* Quarter info */}
        <div className="bg-amber-50 p-3 rounded-lg mt-4">
          <div className="text-sm text-amber-800 font-medium">Current Quarter</div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-amber-900">
              Quarter {currentQuarter} of Juz {currentJuz}
            </div>
            <div className="text-xs text-amber-700">
              {quarterInfo && `Starts at ${quarterInfo.surah}:${quarterInfo.ayah}`}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-6">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={markCurrentAyahAsRead}
          >
            Mark as Read
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            onClick={saveProgress}
          >
            <Save size={16} className="mr-1" />
            Save
          </Button>
        </div>
        
        {saveStatus && (
          <div className="text-center text-sm mt-2 text-green-600">{saveStatus}</div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <Info size={14} className="mr-1" />
          {isSurahCompleted(session.currentSurah) 
            ? "This surah is completed" 
            : `${currentSurahData?.verseCount - session.currentAyah + 1} ayahs remaining in this surah`}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={resetProgress}
        >
          <RotateCcw size={14} className="mr-1" />
          Reset
        </Button>
      </CardFooter>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <Info size={14} className="mr-1" />
          {isSurahCompleted(session.currentSurah) 
            ? "This surah is completed" 
            : `${currentSurahData?.verseCount - session.currentAyah + 1} ayahs remaining in this surah`}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={resetProgress}
        >
          <RotateCcw size={14} className="mr-1" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReadingProgress;