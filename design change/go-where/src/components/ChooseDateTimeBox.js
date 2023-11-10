import React from "react";
import { DateObject, Calendar } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

export const ChooseDateTimeBox = ({updateTimeBox}, timeBox)=> {
    
    // const [values, setValues] = useState(
    //     [].map((number) =>
    //         new DateObject().set({
    //             day: number,
    //             hour: number,
    //             minute: number,
    //             // second: number,
    //         })
    //     )
    // );
    const today = new DateObject().set({minute: 0});
    
    // console.log(values);

    return (
        <div>
            <h2>Choose a Date</h2>
            <Calendar
                multiple
                value={timeBox}
                onChange={dateObj => updateTimeBox(dateObj)}
                format="DD/MM/YYYY HH:mm"
                minDate={today}
                plugins={[
                    <TimePicker
                        position="bottom"
                        hideSeconds={true}
                        />,
                    <DatePanel markFocused/>
                ]}
            />
        </div>
    );
};