import { CarDTO } from "../dtos/CarDTO";

export interface CarDetailsParams {
    car: CarDTO;
}

export interface SchedulingParams {
    car: CarDTO;
}

export interface SchedulingDetailsParams {
    car: CarDTO;
    dates: string[];
}

export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    CarDetails: CarDetailsParams;
    Scheduling: SchedulingParams;
    SchedulingDetails: SchedulingDetailsParams;
    SchedulingComplete: undefined;
    MyCars: undefined;
};