import { Collisions } from "./types";

import { collisionTestData } from "./testData";
import { sleep } from "./utils";

export async function getAllCollisions(): Promise<Collisions> {
    await sleep(1000)
    return collisionTestData
}