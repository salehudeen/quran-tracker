import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

const ProgressTrackingForm = () => {
  // Simulated user's last progress
  const [lastProgress, setLastProgress] = useState({
    surah: 2, // Al-Baqarah
    ayah: 75,
    juz: 1,
    lastUpdated: new Date().toISOString()
  });

  // Track current form state
  const [trackingMethod, setTrackingMethod] = useState('continue-surah');
  const [selectedSurah, setSelectedSurah] = useState(lastProgress.surah);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(lastProgress.juz);
  const [multipleSurahs, setMultipleSurahs] = useState([]);

  // Simulated Quran structure data (abbreviated for example)
  const quranData = {
    surahs: [
      { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", versesCount: 7, juz: 1 },
      { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", versesCount: 286, juz: 1 },
      { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", versesCount: 200, juz: 3 },
      // ... more surahs
    ],
    juzs: Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      name: `Juz ${i + 1}`,
      // ... more juz details
    }))
  };

  // Get the currently selected surah's details
  const currentSurah = quranData.surahs.find(s => s.number === selectedSurah) || quranData.surahs[0];

  const handleProgressSubmit = () => {
    let newProgress = {};
    
    switch (trackingMethod) {
      case 'continue-surah':
        newProgress = {
          surah: selectedSurah,
          ayah: selectedAyah,
          juz: currentSurah.juz,
          lastUpdated: new Date().toISOString()
        };
        break;
      case 'complete-juz':
        newProgress = {
          juz: selectedJuz,
          // Find last surah and ayah in the juz
          surah: quranData.surahs.find(s => s.juz === selectedJuz)?.number,
          ayah: 'last', // This would need to be calculated based on juz boundaries
          lastUpdated: new Date().toISOString()
        };
        break;
      case 'multiple-surahs':
        const lastSurah = Math.max(...multipleSurahs);
        newProgress = {
          surah: lastSurah,
          ayah: quranData.surahs.find(s => s.number === lastSurah)?.versesCount,
          juz: quranData.surahs.find(s => s.number === lastSurah)?.juz,
          lastUpdated: new Date().toISOString()
        };
        break;
    }

    setLastProgress(newProgress);
    // Here you would also update this to your backend
    console.log('New progress:', newProgress);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Update Reading Progress
        </CardTitle>
        <CardDescription>
          Last read: Surah {quranData.surahs.find(s => s.number === lastProgress.surah)?.name} (Ayah {lastProgress.ayah})
          <br />
          <span className="text-sm text-gray-500">
            Updated: {new Date(lastProgress.lastUpdated).toLocaleDateString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Method Selection */}
        <div className="space-y-4">
          <Label>How would you like to track your progress?</Label>
          <RadioGroup 
            value={trackingMethod} 
            onValueChange={setTrackingMethod}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="continue-surah" id="continue-surah" />
              <Label htmlFor="continue-surah">Continue in current Surah</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="complete-juz" id="complete-juz" />
              <Label htmlFor="complete-juz">Completed entire Juz</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple-surahs" id="multiple-surahs" />
              <Label htmlFor="multiple-surahs">Read multiple Surahs</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Dynamic Form Based on Selection */}
        <div className="space-y-4">
          {trackingMethod === 'continue-surah' && (
            <>
              <div className="space-y-2">
                <Label>Select Surah</Label>
                <Select 
                  value={selectedSurah.toString()} 
                  onValueChange={(v) => setSelectedSurah(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {quranData.surahs.map(surah => (
                      <SelectItem key={surah.number} value={surah.number.toString()}>
                        {surah.number}. {surah.name} ({surah.nameArabic})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Ayah</Label>
                <Select
                  value={selectedAyah?.toString()}
                  onValueChange={(v) => setSelectedAyah(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verse number" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: currentSurah.versesCount }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Ayah {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {trackingMethod === 'complete-juz' && (
            <div className="space-y-2">
              <Label>Select completed Juz</Label>
              <Select
                value={selectedJuz.toString()}
                onValueChange={(v) => setSelectedJuz(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {quranData.juzs.map(juz => (
                    <SelectItem key={juz.number} value={juz.number.toString()}>
                      Juz {juz.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {trackingMethod === 'multiple-surahs' && (
            <div className="space-y-2">
              <Label>Select completed Surahs</Label>
              <div className="grid grid-cols-2 gap-4">
                {quranData.surahs.map(surah => (
                  <div key={surah.number} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`surah-${surah.number}`}
                      checked={multipleSurahs.includes(surah.number)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMultipleSurahs([...multipleSurahs, surah.number]);
                        } else {
                          setMultipleSurahs(multipleSurahs.filter(n => n !== surah.number));
                        }
                      }}
                    />
                    <Label htmlFor={`surah-${surah.number}`}>
                      {surah.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reading Progress Visualization */}
        <div className="space-y-2">
          <Label>Overall Progress</Label>
          <Progress value={(lastProgress.juz / 30) * 100} />
          <div className="text-sm text-gray-500 flex justify-between">
            <span>Juz {lastProgress.juz}/30</span>
            <span>{((lastProgress.juz / 30) * 100).toFixed(1)}% Complete</span>
          </div>
        </div>

        <Button 
          onClick={handleProgressSubmit}
          className="w-full flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Update Progress
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProgressTrackingForm;