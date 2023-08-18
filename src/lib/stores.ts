import { browser } from "$app/environment";
import moment from "moment-timezone";
import { writable } from "svelte/store";

let default_offset: number = moment.tz(moment.utc(), 'Europe/Rome').utcOffset();

const tz = writable<number>(default_offset);

tz.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('tz', value.toString())
    }
})

export default tz