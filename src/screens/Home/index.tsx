import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { RootStackParamList } from '../../@types/navigation';
import { database } from '../../database';
import { api } from '../../services/api';
import { CarModel } from '../../database/model/CarModel';
import { CarDTO } from '../../dtos/CarDTO';

import Logo from '../../assets/logo.svg';

import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
    Container,
    Header,
    HeaderContent,
    TotalCards,
    CarList,
} from './styles';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function Home({ navigation }: HomeProps) {
    const [cars, setCars] = useState<CarDTO[]>([] as CarDTO[]);
    const [loading, setLoading] = useState(true);

    const netInfo = useNetInfo();

    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails', { car });
    }

    async function offlineSynchronize() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await api
                    .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

                const { changes, latestVersion } = response.data;
                return { changes, timestamp: latestVersion }
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users;
                await api.post('/users/sync', user).catch(console.log);
            },
        });
    }

    useEffect(() => {
        let isMounted = true;

        async function fetchCars() {
            try {
                const carCollection = database.get<CarModel>('cars');
                const cars = await carCollection.query().fetch();
                const carsList: CarDTO[] =
                    cars.map(car => {
                        return {
                            id: car.id,
                            brand: car.brand,
                            name: car.name,
                            about: car.about,
                            period: car.period,
                            price: car.price,
                            fuel_type: car.fuel_type,
                            thumbnail: car.thumbnail,
                        }
                    }
                    );
                if (isMounted) {
                    setCars(carsList);
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (isMounted)
                    setLoading(false);
            }

        }

        fetchCars();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (netInfo.isConnected === true) {
            offlineSynchronize();
        }
    }, [netInfo.isConnected]);

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <Header>
                <HeaderContent>
                    <Logo
                        width={RFValue(108)}
                        height={RFValue(12)}
                    />
                    {
                        !loading &&
                        <TotalCards>
                            Total de {cars.length} carros
                        </TotalCards>
                    }
                </HeaderContent>
            </Header>
            {loading ? <LoadAnimation /> :
                <CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) =>
                        <Car data={item} onPress={() => handleCarDetails(item)} />}
                />
            }

        </Container>
    );
}