import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schemas } from './schema';
import { UserModel } from "./model/UserModel";
import { CarModel } from "./model/CarModel";

const adapter = new SQLiteAdapter({
    schema: schemas
});

export const database = new Database({
    adapter,
    modelClasses: [
        UserModel,
        CarModel
    ],
})