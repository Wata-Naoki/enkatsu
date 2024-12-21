'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DateTimeSelector } from '../DateTimeSelector';

interface TimeSlot {
  label?: string;
  startTime: string;
  endTime: string;
}

interface DateTimeOption {
  date: Date;
  timeSlots: TimeSlot[];
}

export const EventCreationForm = () => {
  const router = useRouter();
  const [dateOptions, setDateOptions] = useState<DateTimeOption[]>([]);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleDateTimeAdd = (newDateTime: {
    date: Date;
    timeSlots: TimeSlot[];
  }) => {
    setDateOptions((prev) => {
      // 同じ日付が既に存在する場合は更新、存在しない場合は追加
      const existingIndex = prev.findIndex(
        (option) =>
          option.date.toDateString() === newDateTime.date.toDateString()
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newDateTime;
        return updated;
      }

      return [...prev, newDateTime];
    });
  };

  const handleRemoveDate = (index: number) => {
    setDateOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 編集モード用の関数
  const handleEditDate = (
    index: number,
    updatedDateTime: { date: Date; timeSlots: TimeSlot[] }
  ) => {
    setDateOptions((prev) => {
      const updated = [...prev];
      updated[index] = updatedDateTime;
      return updated;
    });
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">イベント調整</h1>
          <p className="text-gray-600">
            イベントの詳細を入力して、参加者の都合を確認しましょう
          </p>
        </div>

        <div className="grid gap-6">
          {/* イベント基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>イベント情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    イベント名
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="例：忘年会"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">説明</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder="イベントの詳細を記入してください"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 候補日時 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                候補日時
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <DateTimeSelector
                  onDateTimeAdd={handleDateTimeAdd}
                  selectedDates={dateOptions.map((option) => option.date)}
                />
                {dateOptions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">選択された候補日時</h3>
                    {dateOptions
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((option, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-4 space-y-4"
                        >
                          {editingIndex === index ? (
                            // 編集モード
                            <div className="space-y-4">
                              <DateTimeSelector
                                onDateTimeAdd={(dateTime) =>
                                  handleEditDate(index, dateTime)
                                }
                                selectedDates={[option.date]}
                                initialTimeSlots={option.timeSlots}
                                onCancel={() => setEditingIndex(null)}
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingIndex(null)}
                                >
                                  キャンセル
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // 表示モード
                            <div className="flex justify-between items-center">
                              <div
                                className="flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                                onClick={() => setEditingIndex(index)}
                              >
                                <p className="font-medium">
                                  {format(option.date, 'PPP', { locale: ja })}
                                </p>
                                <div className="text-sm text-gray-600">
                                  {option.timeSlots.map((slot, i) => (
                                    <span key={i}>
                                      {slot.label
                                        ? `${slot.label}(${slot.startTime}-${slot.endTime})`
                                        : `${slot.startTime}-${slot.endTime}`}
                                      {i < option.timeSlots.length - 1
                                        ? '、'
                                        : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleRemoveDate(index)}
                              >
                                削除
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 参加者設定 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                参加者設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    参加者の追加方法
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4">
                      URLで共有
                    </Button>
                    <Button variant="outline" className="h-auto py-4">
                      LINEで共有
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 作成ボタン */}
          <div className="text-center">
            <Button
              size="lg"
              className="px-8"
              disabled={!eventName || dateOptions.length === 0}
            >
              イベントを作成
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
