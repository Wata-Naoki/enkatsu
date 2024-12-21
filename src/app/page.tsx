'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator, Calendar } from 'lucide-react';

const AppSelectionScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 w-full flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full h-full">
        <h1 className="text-3xl font-bold text-center mb-12">
          イベント管理アプリ
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                イベント調整
              </CardTitle>
              <CardDescription>
                参加者の都合を確認して最適な日程を調整します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600">
                <li>複数の候補日から最適な日程を選択</li>
                <li>参加者の出欠管理</li>
                <li>コメント機能</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                割り勘計算
              </CardTitle>
              <CardDescription>
                イベントの費用を簡単に分配します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600">
                <li>総額の自動計算</li>
                <li>参加者ごとの支払額計算</li>
                <li>精算金額の表示</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppSelectionScreen;
