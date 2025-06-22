import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Book, Play, Volume2, Globe, Languages, BookOpen } from 'lucide-react';
import { transliterate } from 'transliteration';
import { arabicToLatin } from 'arabic-transliterate';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// B2 Level Language Learning Content
const lessons = [
  {
    id: 1,
    title: "Advanced Conversation - Business Meeting",
    level: "B2.1",
    category: "Business",
    content: {
      english: "Good morning, everyone. I'd like to begin today's meeting by discussing our quarterly sales performance. The results have exceeded our expectations, showing a 15% increase compared to last quarter.",
      french: "Bonjour tout le monde. J'aimerais commencer la réunion d'aujourd'hui en discutant de nos performances de ventes trimestrielles. Les résultats ont dépassé nos attentes, montrant une augmentation de 15% par rapport au trimestre dernier.",
      arabic: "صباح الخير للجميع. أود أن أبدأ اجتماع اليوم بمناقشة أداء مبيعاتنا الفصلية. لقد تجاوزت النتائج توقعاتنا، حيث أظهرت زيادة بنسبة 15% مقارنة بالربع الماضي."
    },
    vocabulary: {
      english: ["quarterly", "performance", "exceeded", "expectations", "increase"],
      french: ["trimestriel", "performance", "dépassé", "attentes", "augmentation"],
      arabic: ["فصلية", "أداء", "تجاوزت", "توقعات", "زيادة"]
    }
  },
  {
    id: 2,
    title: "Complex Grammar - Conditional Statements",
    level: "B2.2",
    category: "Grammar",
    content: {
      english: "If we had invested more in digital marketing last year, we would have seen better results. However, we can learn from this experience and apply it to our future strategies.",
      french: "Si nous avions investi davantage dans le marketing numérique l'année dernière, nous aurions vu de meilleurs résultats. Cependant, nous pouvons apprendre de cette expérience et l'appliquer à nos stratégies futures.",
      arabic: "لو كنا استثمرنا أكثر في التسويق الرقمي العام الماضي، لكنا رأينا نتائج أفضل. ومع ذلك، يمكننا أن نتعلم من هذه التجربة ونطبقها على استراتيجياتنا المستقبلية."
    },
    vocabulary: {
      english: ["invested", "digital marketing", "strategies", "experience", "apply"],
      french: ["investi", "marketing numérique", "stratégies", "expérience", "appliquer"],
      arabic: ["استثمرنا", "التسويق الرقمي", "استراتيجيات", "التجربة", "نطبق"]
    }
  },
  {
    id: 3,
    title: "Cultural Discussion - Travel and Traditions",
    level: "B2.3",
    category: "Culture",
    content: {
      english: "Traveling allows us to discover diverse cultures and traditions. Each country has its unique customs that reflect centuries of history and social development.",
      french: "Voyager nous permet de découvrir des cultures et traditions diverses. Chaque pays a ses coutumes uniques qui reflètent des siècles d'histoire et de développement social.",
      arabic: "السفر يسمح لنا باكتشاف الثقافات والتقاليد المتنوعة. كل بلد له عاداته الفريدة التي تعكس قرونًا من التاريخ والتطور الاجتماعي."
    },
    vocabulary: {
      english: ["diverse", "traditions", "customs", "reflect", "development"],
      french: ["diverses", "traditions", "coutumes", "reflètent", "développement"],
      arabic: ["متنوعة", "التقاليد", "عادات", "تعكس", "التطور"]
    }
  }
];

// Text-to-Speech functionality
const TextToSpeech = ({ text, language, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      onPlay && onPlay();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language for better pronunciation
      const langCodes = {
        english: 'en-US',
        french: 'fr-FR',
        arabic: 'ar-SA'
      };
      
      utterance.lang = langCodes[language] || 'en-US';
      utterance.rate = 0.8; // Slower for learning
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={speak}
      disabled={isPlaying}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
        isPlaying
          ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
      }`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
      ) : (
        <Play className="w-4 h-4 mr-1" />
      )}
      {isPlaying ? 'Playing...' : 'Listen'}
    </button>
  );
};

// Arabic Transliteration Component
const ArabicText = ({ text }) => {
  const [showTransliteration, setShowTransliteration] = useState(true);
  
  // Try to transliterate Arabic text
  let transliteratedText = '';
  try {
    transliteratedText = arabicToLatin(text);
  } catch (error) {
    // Fallback to basic transliteration
    transliteratedText = transliterate(text);
  }

  return (
    <div className="space-y-2">
      <div className="text-right text-lg leading-relaxed font-arabic">
        {text}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowTransliteration(!showTransliteration)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {showTransliteration ? 'Hide' : 'Show'} Transliteration
        </button>
      </div>
      {showTransliteration && (
        <div className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
          {transliteratedText}
        </div>
      )}
    </div>
  );
};

// Language Panel Component
const LanguagePanel = ({ title, content, language, vocabulary }) => {
  const [showVocabulary, setShowVocabulary] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          {title}
        </h3>
        <TextToSpeech text={content} language={language} />
      </div>
      
      <div className="mb-4">
        {language === 'arabic' ? (
          <ArabicText text={content} />
        ) : (
          <p className="text-gray-700 leading-relaxed text-lg">
            {content}
          </p>
        )}
      </div>
      
      <div className="border-t pt-4">
        <button
          onClick={() => setShowVocabulary(!showVocabulary)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <BookOpen className="w-4 h-4 mr-1" />
          {showVocabulary ? 'Hide' : 'Show'} Key Vocabulary
        </button>
        
        {showVocabulary && (
          <div className="mt-3 space-y-2">
            {vocabulary.map((word, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className={`font-medium ${language === 'arabic' ? 'text-right font-arabic' : ''}`}>
                  {word}
                </span>
                <TextToSpeech text={word} language={language} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Lesson Component
const LessonView = ({ lesson }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Lesson Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center justify-center space-x-4 text-blue-100">
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            {lesson.level}
          </span>
          <span className="bg-purple-500 px-3 py-1 rounded-full text-sm">
            {lesson.category}
          </span>
        </div>
      </div>

      {/* Language Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LanguagePanel
          title="🇺🇸 English"
          content={lesson.content.english}
          language="english"
          vocabulary={lesson.vocabulary.english}
        />
        <LanguagePanel
          title="🇫🇷 Français"
          content={lesson.content.french}
          language="french"
          vocabulary={lesson.vocabulary.french}
        />
        <LanguagePanel
          title="🇸🇦 العربية"
          content={lesson.content.arabic}
          language="arabic"
          vocabulary={lesson.vocabulary.arabic}
        />
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Lessons
          </button>
        </div>
        <LessonView lesson={selectedLesson} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Language Learning Manual
                </h1>
                <p className="text-sm text-gray-600">
                  Master English, French & Arabic • B2 Level
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Book className="w-4 h-4" />
              <span>{lessons.length} Lessons Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your B2 Language Journey! 🌍
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Master advanced conversations, complex grammar, and cultural nuances in English, French, and Arabic. 
            Each lesson includes audio pronunciation, vocabulary building, and transliteration support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Audio Pronunciation</span>
              </div>
              <p className="text-sm text-gray-600">
                Click any text to hear native pronunciation
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Three Languages</span>
              </div>
              <p className="text-sm text-gray-600">
                Compare content side-by-side
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Arabic Transliteration</span>
              </div>
              <p className="text-sm text-gray-600">
                Latin script for easy reading
              </p>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {lesson.level}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {lesson.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {lesson.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">🇺🇸</span> {lesson.content.english.substring(0, 50)}...
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">🇫🇷</span> {lesson.content.french.substring(0, 50)}...
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <span className="font-medium">🇸🇦</span> {lesson.content.arabic.substring(0, 30)}...
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{lesson.vocabulary.english.length} vocabulary words</span>
                  <span className="text-blue-600 font-medium">Start Lesson →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;