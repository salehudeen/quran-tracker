import { useState, useEffect } from "react";
import { generateClient } from '@aws-amplify/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Save, RotateCcw, ChevronDown } from "lucide-react";
import * as mutations from '../graphql/mutations';
import surahs from '../../surahs.json';
import juzData from '../../juz.json';

const client = generateClient();

const ReadingProgress = ({ userId }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSurahList, setShowSurahList] = useState(false);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await client.graphql({
          query: mutations.getReadingProgress,
          variables: { userId }
        });
        setSession(data.getReadingProgress || { currentSurah: 1, currentAyah: 1, completedJuz: [] });
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  const isRestricted = (surahNumber) => {
    return session?.completedJuz.some(juz => juzData[juz].surahStart <= surahNumber);
  };

  const saveProgress = async () => {
    try {
      await client.graphql({
        query: mutations.updateReadingProgress,
        variables: { input: { userId, currentSurah: session.currentSurah, currentAyah: session.currentAyah } }
      });
    } catch (err) {
      console.error("Error saving progress:", err);
      setError("Failed to save progress");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Progress</CardTitle>
        <Book size={20} className="text-gray-600" />
      </CardHeader>
      <CardContent>
        <div>
          <label>Surah</label>
          <div className="relative">
            <div className="p-2 border rounded cursor-pointer" onClick={() => setShowSurahList(!showSurahList)}>
              {surahs[session.currentSurah - 1]?.nameEnglish}
              <ChevronDown size={16} />
            </div>
            {showSurahList && (
              <div className="absolute bg-white border rounded shadow-lg">
                {surahs.map((surah) => (
                  <div key={surah.number} 
                       className={`p-2 cursor-pointer ${isRestricted(surah.number) ? 'text-gray-400' : 'hover:bg-gray-100'}`} 
                       onClick={() => !isRestricted(surah.number) && setSession(prev => ({ ...prev, currentSurah: surah.number }))}>
                    {surah.nameEnglish} ({surah.nameArabic})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button onClick={saveProgress}>Save Progress</Button>
      </CardContent>
    </Card>
  );
};

export default ReadingProgress;
