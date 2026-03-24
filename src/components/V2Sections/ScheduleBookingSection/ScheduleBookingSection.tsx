/**
 * ScheduleBookingSection — Sidebar value-props + modular calendar widget.
 *
 * Architecture:
 *  - `provider: 'built-in'`  → renders BuiltInCalendar (interactive, swappable)
 *  - `provider: 'calendly'`  → renders Calendly iframe embed
 *  - `provider: 'cal-com'`   → renders Cal.com iframe embed
 *  - `provider: 'custom'`    → renders placeholder (for future custom integrations)
 *
 * To switch to Calendly: change `provider` to 'calendly' and set `embedUrl`
 * in content.ts — no component code changes needed.
 *
 * Client component — contains interactive calendar state.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ScheduleBookingSection as ScheduleBookingSectionData } from '@/config/types';
import V2Icon from '../V2Icon/V2Icon';
import './ScheduleBookingSection.css';

interface Props {
  data: ScheduleBookingSectionData;
}

// =============================================================================
// CALENDAR UTILITIES
// =============================================================================

/** Get the number of days in a given month (0-indexed month) */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get the weekday index (0=Sun) of the first day of the month */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// =============================================================================
// BUILT-IN CALENDAR
// =============================================================================

interface BuiltInCalendarProps {
  timeSlots: string[];
  submitLabel: string;
}

function BuiltInCalendar({ timeSlots, submitLabel }: BuiltInCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Previous month's trailing days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1,
  );

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    setSelectedDay(null);
    setSelectedSlot(null);
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    setSelectedDay(null);
    setSelectedSlot(null);
  }, []);

  const handleDayClick = useCallback((day: number) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  }, []);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };

  return (
    <>
      <div className="v2-booking__widget-grid">
        {/* Calendar pane */}
        <div className="v2-booking__calendar">
          <div className="v2-booking__calendar-nav">
            <span className="v2-booking__calendar-month">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="v2-booking__calendar-arrows">
              <button
                className="v2-booking__calendar-arrow"
                onClick={prevMonth}
                aria-label="Previous month"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="v2-booking__calendar-arrow"
                onClick={nextMonth}
                aria-label="Next month"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="v2-booking__calendar-weekdays">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="v2-booking__calendar-weekday">
                {wd}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="v2-booking__calendar-days">
            {/* Trailing days from previous month */}
            {Array.from({ length: firstDay }, (_, i) => (
              <button
                key={`prev-${i}`}
                className="v2-booking__calendar-day v2-booking__calendar-day--disabled"
                disabled
                type="button"
              >
                {prevMonthDays - firstDay + 1 + i}
              </button>
            ))}
            {/* Current month days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const past = isPast(day);
              const selected = selectedDay === day;
              const todayDay = isToday(day);
              const classes = [
                'v2-booking__calendar-day',
                past ? 'v2-booking__calendar-day--disabled' : '',
                selected ? 'v2-booking__calendar-day--selected' : '',
                todayDay && !selected ? 'v2-booking__calendar-day--today' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={day}
                  className={classes}
                  disabled={past}
                  onClick={() => handleDayClick(day)}
                  type="button"
                  aria-label={`${MONTH_NAMES[viewMonth]} ${day}`}
                  aria-pressed={selected}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="v2-booking__slots">
          <h4 className="v2-booking__slots-heading">Available Times</h4>
          {timeSlots.map((slot) => (
            <button
              key={slot}
              className={`v2-booking__slot${selectedSlot === slot ? ' v2-booking__slot--selected' : ''}`}
              onClick={() => setSelectedSlot(slot)}
              type="button"
              aria-pressed={selectedSlot === slot}
            >
              {slot}
            </button>
          ))}

          <div className="v2-booking__submit-area">
            <button
              className="v2-booking__submit"
              disabled={!selectedDay || !selectedSlot}
              type="button"
            >
              {submitLabel}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// EXTERNAL EMBED
// =============================================================================

function ExternalEmbed({ url, title }: { url: string; title: string }) {
  return (
    <iframe
      className="v2-booking__embed"
      src={url}
      title={title}
      loading="lazy"
    />
  );
}

function EmbedPlaceholder() {
  return (
    <div className="v2-booking__embed-placeholder">
      Calendar integration coming soon.
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ScheduleBookingSection({ data }: Props) {
  const renderWidget = () => {
    switch (data.provider) {
      case 'built-in':
        return (
          <BuiltInCalendar
            timeSlots={data.widget.timeSlots}
            submitLabel={data.widget.submitLabel}
          />
        );
      case 'calendly':
        return data.embedUrl ? (
          <ExternalEmbed url={data.embedUrl} title="Calendly Scheduler" />
        ) : (
          <EmbedPlaceholder />
        );
      case 'cal-com':
        return data.embedUrl ? (
          <ExternalEmbed url={data.embedUrl} title="Cal.com Scheduler" />
        ) : (
          <EmbedPlaceholder />
        );
      case 'custom':
      default:
        return <EmbedPlaceholder />;
    }
  };

  return (
    <div className="v2-container">
      <div className="v2-booking">
        {/* ── Left: Sidebar ── */}
        <div className="v2-booking__sidebar px-layer--fg">
          <div>
            <h2 className="v2-booking__sidebar-heading">
              {data.sidebar.heading}
            </h2>
          </div>

          <div className="v2-booking__expect-list">
            {data.sidebar.items.map((item) => (
              <div key={item.title} className="v2-booking__expect-item">
                <div className="v2-booking__expect-icon">
                  <V2Icon name={item.icon} size={22} />
                </div>
                <div>
                  <h3 className="v2-booking__expect-title">{item.title}</h3>
                  <p className="v2-booking__expect-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="v2-booking__trust">
            <div className="v2-booking__trust-header">
              <svg
                className="v2-booking__trust-star"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="v2-booking__trust-label">
                {data.sidebar.trustBadge.label}
              </span>
            </div>
            <p className="v2-booking__trust-text">
              {data.sidebar.trustBadge.text}
            </p>
          </div>
        </div>

        {/* ── Right: Calendar Widget ── */}
        <div className="v2-booking__widget px-layer--fg" data-px-delay="1">
          <div className="v2-booking__widget-header">
            <div>
              <span className="v2-booking__widget-label">
                {data.widget.label}
              </span>
              <h3 className="v2-booking__widget-title">
                {data.widget.title}
              </h3>
            </div>
            <span className="v2-booking__widget-tz">
              Timezone: {data.widget.timezone}
            </span>
          </div>

          {renderWidget()}
        </div>
      </div>
    </div>
  );
}
