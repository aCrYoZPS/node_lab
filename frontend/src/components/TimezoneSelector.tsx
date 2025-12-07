import React, { useState } from 'react';
import TimezoneSelect, { type ITimezone } from 'react-timezone-select';

interface TimezoneSelectorProps {
    onTimezoneChange: (timezone: string) => void;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ onTimezoneChange }) => {
    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const handleChange = (timezone: ITimezone | string) => {
        const zoneValue = typeof timezone === 'string' ? timezone : timezone.value;

        setSelectedTimezone(timezone as ITimezone);
        onTimezoneChange(zoneValue);
    };

    return (
        <div style={{ zIndex: 10 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Часовой пояс (Timezone):</label>
            <TimezoneSelect
                value={selectedTimezone}
                onChange={handleChange}
                placeholder="Выберите ваш часовой пояс..."
            />
        </div>
    );
};

export default TimezoneSelector;
