import React, { useState } from 'react';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';

import { DateData } from 'react-native-calendars/src/types';

import { SchedulingParams, RootStackParamList } from '../../routes/RootStackParamList';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar, generateInterval, MarkedDateProps } from '../../components/Calendar';

import { getPlatformDate } from '../../utils/getPlatformDate';

import ArrowSvg from '../../assets/arrow.svg';

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer,
} from './styles';

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}


type SchedulingScreenProp = NavigationProp<RootStackParamList, 'Home'>;

export function Scheduling() {
    const [lastSelectedDate, setLastSelectedDate] = useState<DateData>({} as DateData);
    const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

    const theme = useTheme();
    const navigation = useNavigation<SchedulingScreenProp>();
    const route = useRoute();
    const { car } = route.params as SchedulingParams;

    function handleConfirmRental() {
        navigation.navigate('SchedulingDetails', {
            car,
            dates: Object.keys(markedDates),
        });
    }

    function handleBack() {
        navigation.goBack();
    }

    function handleChangeDate(date: DateData) {
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if (start.timestamp > end.timestamp) {
            start = end;
            end = start;
        }

        setLastSelectedDate(end);
        const interval = generateInterval(start, end);
        setMarkedDates(interval);

        const firstDate = Object.keys(interval)[0];
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

        setRentalPeriod({
            startFormatted: format(parseISO(firstDate), 'dd/MM/yyyy'),
            endFormatted: format(parseISO(endDate), 'dd/MM/yyyy'),
        });
    }

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <Header>
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />

                <Title>
                    Escolha uma {'\n'}
                    data de início e {'\n'}
                    fim do aluguel
                </Title>

                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue selected={!!rentalPeriod.endFormatted}>
                            {rentalPeriod.endFormatted}
                        </DateValue>
                    </DateInfo>
                </RentalPeriod>

            </Header>

            <Content>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
            </Content>

            <Footer>
                <Button
                    title="Confirmar"
                    onPress={handleConfirmRental}
                    enabled={!!rentalPeriod.startFormatted}
                />
            </Footer>
        </Container>
    );
}