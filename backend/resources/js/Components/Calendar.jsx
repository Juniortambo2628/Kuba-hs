import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from "sonner";

const Calendar = ({ events = [], onEventClick, onDateSelect }) => {
    return (
        <Card className="w-full shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-xl font-bold">Service Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        select={onDateSelect}
                        eventClick={onEventClick}
                        height="auto"
                        eventBackgroundColor="hsl(var(--primary))"
                        eventBorderColor="hsl(var(--primary))"
                        eventClassNames="rounded-md border-none shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                    />
                </div>
            </CardContent>
            <style jsx global>{`
                .fc .fc-button-primary {
                    background-color: hsl(var(--secondary));
                    border-color: hsl(var(--border));
                    color: hsl(var(--secondary-foreground));
                    text-transform: capitalize;
                    font-weight: 500;
                }
                .fc .fc-button-primary:hover {
                    background-color: hsl(var(--accent));
                    border-color: hsl(var(--border));
                }
                .fc .fc-button-primary:not(:disabled).fc-button-active, 
                .fc .fc-button-primary:not(:disabled):active {
                    background-color: hsl(var(--primary));
                    border-color: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                }
                .fc th {
                    padding: 12px 0 !important;
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: hsl(var(--muted-foreground));
                }
                .fc .fc-daygrid-day-number {
                    padding: 8px !important;
                    font-size: 0.875rem;
                }
            `}</style>
        </Card>
    );
};

export default Calendar;
