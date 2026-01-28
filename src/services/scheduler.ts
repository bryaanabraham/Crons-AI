import { addDays, addHours, addBusinessDays, set } from 'date-fns';
import { SchedulingRule } from '@/types/cron';

export class DynamicScheduler {
    /**
     * Calculates the next scheduled date based on a rule and a reference date (usually the parent's completion date).
     */
    static calculateNextDate(rule: SchedulingRule, referenceDate: Date = new Date()): Date {
        switch (rule.type) {
            case 'immediate':
                return referenceDate;

            case 'relative':
                let nextDate = referenceDate;
                if (rule.relativeDays) {
                    nextDate = addDays(nextDate, rule.relativeDays);
                }
                if (rule.relativeHours) {
                    nextDate = addHours(nextDate, rule.relativeHours);
                }
                return nextDate;

            case 'absolute':
                if (rule.specificDate) {
                    // If specific date is provided, use it. Handle string or Date.
                    return new Date(rule.specificDate);
                }
                if (rule.specificTime) {
                    // If only time is provided, assuming "next occurrence" of that time relative to referenceDate?
                    // Or just setting the time on the reference date?
                    // Requirement 7.2 implies "specific dates/times".
                    // If just time, usually means "today at X" or "tomorrow at X" depending on if X has passed.
                    // For simplicity, let's set the time on the reference date.
                    const [hours, minutes] = rule.specificTime.split(':').map(Number);
                    let absoluteDate = set(referenceDate, { hours, minutes, seconds: 0, milliseconds: 0 });

                    // If the resulting time is in the past relative to reference (e.g. now is 10am, schedule is 9am), 
                    // should we push to tomorrow? 
                    // Often logic dictates forward scheduling. Let's assume yes.
                    if (absoluteDate < referenceDate) {
                        absoluteDate = addDays(absoluteDate, 1);
                    }
                    return absoluteDate;
                }
                return referenceDate; // Fallback

            case 'business_day':
                // Next business day logic
                // If offset is N, add N business days.
                const offset = rule.businessDayOffset || 0;
                let businessDate = addBusinessDays(referenceDate, offset);

                // Handle time of day
                if (rule.timeOfDay) {
                    if (rule.timeOfDay === 'morning') {
                        businessDate = set(businessDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
                    } else if (rule.timeOfDay === 'afternoon') {
                        businessDate = set(businessDate, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 });
                    } else if (rule.timeOfDay.includes(':')) {
                        const [hours, minutes] = rule.timeOfDay.split(':').map(Number);
                        businessDate = set(businessDate, { hours, minutes, seconds: 0, milliseconds: 0 });
                    }
                }
                return businessDate;

            default:
                return referenceDate;
        }
    }
}
