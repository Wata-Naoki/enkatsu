// components/event/DateTimeSelector/index.tsx
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface TimeSlot {
  label?: string;
  startTime: string;
  endTime: string;
}

const UNIVERSITY_TIME_SLOTS: TimeSlot[] = [
  { label: '1限', startTime: '09:00', endTime: '10:30' },
  { label: '2限', startTime: '10:40', endTime: '12:10' },
  { label: '3限', startTime: '13:00', endTime: '14:30' },
  { label: '4限', startTime: '14:40', endTime: '16:10' },
  { label: '5限', startTime: '16:20', endTime: '17:50' },
  { label: '6限', startTime: '18:00', endTime: '19:30' },
];
// 時間スロット生成関数を更新
const generateTimeSlots = (
  start: string,
  end: string,
  intervalMinutes: string | number
): TimeSlot[] => {
  // 時間間隔なしの場合は1枠のみ生成
  if (intervalMinutes === 'no-interval') {
    return [
      {
        startTime: start,
        endTime: end,
      },
    ];
  }

  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  let currentTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  const interval = Number(intervalMinutes);

  while (currentTime + interval <= endTime) {
    const currentHour = Math.floor(currentTime / 60);
    const currentMinute = currentTime % 60;
    const nextTime = currentTime + interval;
    const nextHour = Math.floor(nextTime / 60);
    const nextMinute = nextTime % 60;

    slots.push({
      startTime: `${currentHour.toString().padStart(2, '0')}:${currentMinute
        .toString()
        .padStart(2, '0')}`,
      endTime: `${nextHour.toString().padStart(2, '0')}:${nextMinute
        .toString()
        .padStart(2, '0')}`,
    });

    currentTime = nextTime;
  }

  return slots;
};

interface DateTimeSelectorProps {
  onDateTimeAdd: (dateTime: { date: Date; timeSlots: TimeSlot[] }) => void;
  selectedDates: Date[];
  initialTimeSlots?: TimeSlot[]; // 編集モード用
  onCancel?: () => void; // 編集モードのキャンセル用
}
export const DateTimeSelector = ({
  onDateTimeAdd,
  selectedDates,
  initialTimeSlots,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel,
}: DateTimeSelectorProps) => {
  // 編集モードの場合は初期値を設定
  const [timeType, setTimeType] = useState(() => {
    if (initialTimeSlots && initialTimeSlots[0]) {
      if (initialTimeSlots[0].label) return 'university';
      if (initialTimeSlots[0].startTime === '未設定') return 'simple';
      return 'custom';
    }
    return 'simple';
  });
  const [startTime, setStartTime] = useState(
    () => initialTimeSlots?.[0]?.startTime || '09:00'
  );
  const [endTime, setEndTime] = useState(
    () => initialTimeSlots?.[0]?.endTime || '17:00'
  );

  const [interval, setInterval] = useState('60');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };

  // 選択された日付に対する時間スロットを生成
  const handleDateSelect = (date: Date) => {
    let timeSlots: TimeSlot[] = [];

    switch (timeType) {
      case 'simple':
        timeSlots = [{ startTime: '未設定', endTime: '未設定' }];
        break;
      case 'custom':
        timeSlots = generateTimeSlots(
          startTime,
          endTime,
          interval === 'no-interval' ? 'no-interval' : parseInt(interval)
        );
        break;
      case 'university':
        timeSlots = UNIVERSITY_TIME_SLOTS.filter((slot) =>
          selectedTimeSlots.includes(slot.label!)
        );
        break;
    }

    onDateTimeAdd({
      date,
      timeSlots,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* カレンダー */}
        <div className="bg-white p-4 rounded-lg shadow">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => {
              if (!dates) return;
              const newDate = dates[dates.length - 1];
              if (
                newDate &&
                !selectedDates.some((d) => d.getTime() === newDate.getTime())
              ) {
                handleDateSelect(newDate);
              }
            }}
            locale={ja}
            disabled={(date) => date < new Date()}
            className="rounded-md border w-full h-full flex justify-center py-6"
          />
        </div>

        {/* 詳細設定 */}
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="time-settings" className="px-1">
              <AccordionTrigger>詳細な時間設定</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-1">
                  <RadioGroup
                    defaultValue="simple"
                    onValueChange={setTimeType}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <label htmlFor="simple">時間未設定</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <label htmlFor="custom">カスタム時間</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="university" id="university" />
                      <label htmlFor="university">授業時間</label>
                    </div>
                  </RadioGroup>

                  {timeType === 'custom' && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          時間指定
                        </label>
                        <RadioGroup
                          defaultValue="with-interval"
                          className="space-y-2"
                          onValueChange={(value) => {
                            if (value === 'no-interval') {
                              setInterval('no-interval');
                            } else {
                              setInterval('60'); // デフォルトの間隔を設定
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="with-interval"
                              id="with-interval"
                            />
                            <label htmlFor="with-interval">時間間隔あり</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="no-interval"
                              id="no-interval"
                            />
                            <label htmlFor="no-interval">
                              時間間隔なし（1枠のみ）
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            開始時間
                          </label>
                          <Select
                            onValueChange={setStartTime}
                            defaultValue={startTime}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateTimeOptions().map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            終了時間
                          </label>
                          <Select
                            onValueChange={setEndTime}
                            defaultValue={endTime}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {generateTimeOptions().map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 時間間隔の選択は interval が 'no-interval' でない場合のみ表示 */}
                      {interval !== 'no-interval' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            時間間隔
                          </label>
                          <Select
                            onValueChange={setInterval}
                            defaultValue={interval}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30分</SelectItem>
                              <SelectItem value="60">1時間</SelectItem>
                              <SelectItem value="90">1時間30分</SelectItem>
                              <SelectItem value="120">2時間</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                  {timeType === 'university' && (
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      {UNIVERSITY_TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot.label}
                          variant={
                            selectedTimeSlots.includes(slot.label!)
                              ? 'default'
                              : 'outline'
                          }
                          className="w-full"
                          onClick={() => {
                            setSelectedTimeSlots((prev) =>
                              prev.includes(slot.label!)
                                ? prev.filter((s) => s !== slot.label)
                                : [...prev, slot.label!]
                            );
                          }}
                        >
                          {slot.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
