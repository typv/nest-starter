import dayjs from 'dayjs';
import { Frequency, RRule } from 'rrule';

export interface RruleData {
  rruleDtstart?: Date;
  rruleUntil?: Date;
  rruleDurationMs?: number;
  rruleString?: string;
}

export interface RecurringEvent {
  startUtc: string;
  endUtc: string;
}

/**
 * Generates an object containing all necessary RRULE data for a recurring event.
 * This function handles timezone conversion and duration calculation.
 *
 * @param localStartDatetime The local start date and time of the first occurrence.
 * @param localEndDatetime The local end date and time of the first occurrence.
 * @param untilDate The local date when the recurrence should end.
 * @param frequency The frequency of the recurrence (e.g., DAILY, WEEKLY).
 * @returns An object containing the RRULE string, start date, end date, and duration.
 */
export function generateRruleData(
  localStartDatetime: Date,
  localEndDatetime: Date,
  untilDate: Date,
  frequency: Frequency = Frequency.DAILY,
): RruleData {
  const startDateLocal = dayjs(localStartDatetime);
  const untilDateLocal = dayjs(untilDate);

  const dtstartUtc = startDateLocal.utc(true).toDate();
  const untilUtc = untilDateLocal.utc(true).toDate();

  try {
    const rrule = new RRule({
      freq: frequency,
      dtstart: dtstartUtc,
      until: untilUtc,
    });
    const durationMs = startDateLocal.diff(dayjs(localEndDatetime), 'millisecond');

    return {
      rruleString: rrule.toString(),
      rruleDtstart: dtstartUtc,
      rruleUntil: untilUtc,
      rruleDurationMs: Math.abs(durationMs),
    };
  } catch (err) {
    console.error('RruleUtil.generateRruleData', err);
    throw new Error(err);
  }
}

/**
 * Generates a list of concrete recurring events from a saved RRULE string and event duration.
 * This function is used to expand a database record into a full list of events for a calendar view.
 *
 * @param rruleString The RRULE string that defines the recurrence pattern (e.g., 'FREQ=DAILY;UNTIL=20251231T235959Z').
 * @param rruleDurationMs The duration of each event in milliseconds.
 * @param queryStartDate
 * @param queryEndDate
 * @returns A list of event objects, each with a start and end time in UTC.
 */
export function generateRecurringEvents(
  rruleString: string,
  rruleDurationMs: number,
  queryStartDate?: Date,
  queryEndDate?: Date,
): RecurringEvent[] {
  try {
    const rule = RRule.fromString(rruleString);

    const occurrences =
      queryStartDate && queryEndDate
        ? rule.between(queryStartDate, queryEndDate, true)
        : rule.all();

    const eventList = occurrences.map((occurrence) => {
      const startUtc = dayjs(occurrence);
      const endUtc = startUtc.add(Math.abs(rruleDurationMs), 'millisecond');

      return {
        startUtc: startUtc.toISOString(),
        endUtc: endUtc.toISOString(),
      };
    });

    return eventList;
  } catch (err) {
    console.error('RruleUtil.generateRecurringEvents', err);
    throw new Error(err);
  }
}
