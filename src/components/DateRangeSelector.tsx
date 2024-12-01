import React from 'react';
import { addDays, format } from 'date-fns';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          From
        </label>
        <input
          type="date"
          id="startDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e) => onStartDateChange(new Date(e.target.value))}
          min={format(new Date(), 'yyyy-MM-dd')}
          max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="date"
          id="endDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => onEndDateChange(new Date(e.target.value))}
          min={format(startDate, 'yyyy-MM-dd')}
          max={format(addDays(startDate, 30), 'yyyy-MM-dd')}
        />
      </div>
    </div>
  );
}