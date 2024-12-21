'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AppSelectionScreen = () => {
  const router = useRouter();

  const handleEventClick = () => {
    router.push('/event/create');
  };

  const handleSplitClick = () => {
    router.push('/split/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col items-center w-full justify-center h-screen">
        <div className="max-w-4xl px-4 pt-16 pb-40">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
            イベント管理アプリ
          </h1>
          <p className="text-center text-gray-600 mb-12">
            簡単な操作で、イベントの調整から精算までをスムーズに
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card
              className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={handleEventClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  イベント調整
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  参加者の都合を確認して最適な日程を調整します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    複数の候補日から最適な日程を選択
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    参加者の出欠管理
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    コメント機能
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={handleSplitClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Calculator className="w-6 h-6 text-green-500" />
                  割り勘計算
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  イベントの費用を簡単に分配します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    総額の自動計算
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    参加者ごとの支払額計算
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    精算金額の表示
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
