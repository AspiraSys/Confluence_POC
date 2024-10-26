import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader, Box, Stack, Text, Strong, Button, DatePicker, Label, Textfield, Icon } from '@forge/react';

const ModalPop = ({ isOpens, setIsOpen, handleScheduled }) => {

    const closeModal = () => setIsOpen(false);

    const [disabledDates, setDisabledDates] = useState("");
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


    const disableDateFormat = () => {
        const today = new Date();

        today.setDate(today.getDate() - 0);

        const formattedDate = today.toISOString().split('T')[0];
        setDisabledDates(formattedDate)
    }

    const getCurrentTime = () => {
        const now = new Date();
        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
        };
    };

    const parseTime = (timeString) => {
        let time = timeString.toLowerCase().replace(/\s+/g, '');
        const timePattern = /(\d{1,2})([:.]?(\d{2}))?(am|pm)?/;
        const match = time.match(timePattern);

        if (!match) return null;

        let [hours, , minutes, period] = match.slice(1);

        if (!minutes) {
            minutes = '00';
        }

        if (!period) {
            period = hours >= 1 && hours <= 12 ? 'am' : 'pm';
        }

        let hours24 = parseInt(hours, 10);
        if (period === 'pm' && hours24 !== 12) {
            hours24 += 12;
        } else if (period === 'am' && hours24 === 12) {
            hours24 = 0;
        }

        return { hours: hours24, minutes: parseInt(minutes, 10) };
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = String(minutes).padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}:${month}:${year}`;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
    };

    const handleTimeChange = (event) => {
        const inputValue = event.target.value;
        setSelectedTime(inputValue);
        setErrorMessage('');
    };

    const validateTimeFormat = (timeString) => {
        const timePattern = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
        return timePattern.test(timeString);
    };

    const validateTime = () => {
        const { hours: currentHours, minutes: currentMinutes } = getCurrentTime();
        const parsedTime = parseTime(selectedTime);

        // Check if the AM/PM part is missing
        const amPmPattern = /(AM|PM)$/i; // Case-insensitive match for AM or PM
        if (!amPmPattern.test(selectedTime)) {
            setErrorMessage("Please include 'AM' or 'PM' in your time input.");
            return false;
        }

        if (!parsedTime) {
            setErrorMessage("Invalid time format. Please use 'HH:MM AM/PM' format.");
            return false;
        }

        const { hours: inputHours, minutes: inputMinutes } = parsedTime;
        const formattedTime = formatTime(inputHours, inputMinutes);

        // Ensure the formatted time is in proper format before proceeding
        if (!validateTimeFormat(formattedTime)) {
            setErrorMessage("Please enter the time in 'HH:MM AM/PM' format.");
            return false;
        }

        // Time validation: Check if entered time is less than or equal to the current time
        if (
            (inputHours < currentHours) ||
            (inputHours === currentHours && inputMinutes <= currentMinutes)
        ) {
            setErrorMessage(
                `Time must be at least 1 minute ahead of the current time (${formatTime(currentHours, currentMinutes)}).`
            );
            return false;
        }

        return true;
    };

    const scheduleScan = () => {
        if (validateTime()) {
            console.log('Time is valid, proceeding with scheduling...');
            // Proceed with your scheduling logic
            handleScheduled(selectedDate, selectedTime); // Pass date and time to parent
            closeModal();
        }
    };

    useEffect(() => {
        disableDateFormat();
        getCurrentTime();
    }, [])

    return (
        <ModalTransition>
            {isOpens && (
                <Modal onClose={closeModal}>
                    <ModalHeader>
                        <ModalTitle>Schedule your Scan</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Stack>

                            <Box xcss={{ paddingBottom: "space.100" }}>
                                <Label labelFor="timepicker-locale-en">enter the duration</Label>
                                <Textfield
                                    elemAfterInput={
                                        <Box xcss={{ marginTop: "space.050", marginRight: "space.100" }}>
                                            <Icon glyph="stopwatch" label="stopwatch" />
                                        </Box>
                                    }
                                    placeholder="12:00 PM"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                />

                                <Box xcss={{ color: "color.text.accent.red", paddingTop: "sapce.100" }}>
                                    <Text><Strong>{errorMessage}</Strong></Text>
                                </Box>
                            </Box>
                            <Box xcss={{ paddingBottom: "space.100" }}>
                                <Label labelFor="datepicker-locale-en">enter the date</Label>
                                <DatePicker
                                    autoFocus={false}
                                    isOpen={isDatePickerOpen}
                                    // onFocus={() => setIsDatePickerOpen(true)} 
                                    // onBlur={() => setIsDatePickerOpen(false)} 
                                    minDate={disabledDates}
                                    onChange={handleDateChange}
                                    id="datepicker-locale-en"
                                />
                            </Box>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button appearance="subtle" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button appearance="primary" onClick={scheduleScan}>
                            Schedule
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </ModalTransition>
    );
};

export default ModalPop;
