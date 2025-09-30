import { useDispatch, useSelector } from 'react-redux';
import * as bookingsActions from '../redux/bookings/bookingsSlice';

export function useBookings() {
    const dispatch = useDispatch();
    const bookingsState = useSelector(state => state.bookings);
    const { user } = useSelector(state => state.auth);

    const loadBookings = () => dispatch(bookingsActions.fetchBookings());

    const canManageBooking = () => {
        if (!user) return false;
        return user.role === 'Admin';
    };

    const validateTimes = (startTime, endTime) => {
        if (new Date(startTime) >= new Date(endTime)) {
            alert('Час початку має бути раніше часу закінчення.');
            return false;
        }
        return true;
    };

    const parseParticipants = (participantsString) => {
        return (participantsString || '')
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '');
    };

    const createBooking = (data) => dispatch(bookingsActions.createBooking(data));
    const updateBooking = (dataWithId) => dispatch(bookingsActions.updateBooking(dataWithId));
    const deleteBooking = (id) => dispatch(bookingsActions.deleteBooking(id));

    return {
        ...bookingsState,
        user,
        loadBookings,
        canManageBooking,
        validateTimes,
        parseParticipants,
        createBooking,
        updateBooking,
        deleteBooking,
    };
}


