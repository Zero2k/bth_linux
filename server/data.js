import fs from 'fs';

class Data {
    constructor() {
        this.reset();
        this.init();
    }

    init() {
        this.parseJSON();
    }

    reset() {
        this.size = 0;
        this.list = [];
    }

    parseJSON() {
        fs.readFile(__dirname + '/../salar.json', (err, data) => {
            if (err) {
                throw new Error(err);
            }
            this.list = JSON.parse(data);
            this.size = this.list.length;
        });
    }

    /**
     *
     * @param Array list of room.
     * @param Int limit number of room being returned.
     */
    limit(list, limit = null) {
        if (limit !== null) {
            return list.slice(0, limit);
        } else {
            return list;
        }
    }

    /**
     *
     * @param Int limit number of room being returned.
     */
    getList(limit = null) {
        return this.limit(this.list, limit);
    }

    /**
     *
     * @param Int roomId you want information about.
     */
    getSingleRoom(roomId) {
        return this.list.filter(room => {
            if (room.Salsnr === roomId) {
                return room;
            }
        });
    }

    /**
     *
     * @param String houseName you want information about.
     * @param Int limit number of room being returned.
     */
    getRoomsInHouse(houseName, limit = null) {
        let newList = this.list.filter(room => {
            if (room.Hus !== null) {
                if (room.Hus.toLowerCase() === houseName.toLowerCase()) {
                    return room;
                }
            }
        });

        return this.limit(newList, limit);
    }

    /**
     *
     * @param String keyword you want to search for.
     * @param Int limit number of room being returned.
     */
    search(keyword, limit = null) {
        let newList = this.list.filter(room => {
            if (room.Salsnr !== null) {
                if (room.Salsnr.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if (room.Salsnamn !== null) {
                if (room.Salsnamn.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if (room.Lat !== null) {
                if (room.Lat.includes(keyword)) {
                    return room;
                }
            }
            if (room.Long !== null) {
                if (room.Long.includes(keyword)) {
                    return room;
                }
            }
            if (room.Ort !== null) {
                if (room.Ort.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if (room.Hus !== null) {
                if (room.Hus.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if (room.Våning !== null) {
                if (room.Våning.includes(keyword)) {
                    return room;
                }
            }
            if (room.Typ !== null) {
                if (room.Typ.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if (room.Storlek !== null) {
                if (room.Storlek.includes(keyword)) {
                    return room;
                }
            }
        });

        return this.limit(newList, limit);
    }

    /**
     *
     * @param String key to add priority to.
     */
    setPriority(key) {
        switch (key) {
            case "Salsnr":
                return 0.45;
            case "Salsnamn":
                return 0.30;
            case "Lat":
                return 0.15;
            case "Long":
                return 0.15;
            case "Ort":
                return 0.35;
            case "Hus":
                return 0.30;
            case "Våning":
                return 0.10;
            case "Typ":
                return 0.10;
            case "Storlek":
                return 0.05;
        }
    }

    /* Fuzzy Search, inspiration from http://jsfiddle.net/ezwv3uuc/ */
    get_bigrams(string) {
        let j, ref;
        let s = string.toLowerCase();
        let v = new Array(s.length - 1);
        for (let i = j = 0, ref = v.length; j <= ref; i = j += 1) {
            v[i] = s.slice(i, i + 2);
        }
        return v;
    }

    checkStringScore(str1, str2, key) {
        let len, len1;
        let priority = this.setPriority(key);
        if (str1.length > 0 && str2.length > 0) {
            let pairs1 = this.get_bigrams(str1);
            let pairs2 = this.get_bigrams(str2);
            let union = pairs1.length + pairs2.length;
            let hit_count = 0;
            for (let j = 0, len = pairs1.length; j < len; j++) {
                let x = pairs1[j];
                for (let k = 0, len1 = pairs2.length; k < len1; k++) {
                    let y = pairs2[k];
                    if (x === y) {
                        hit_count++;
                    }
                }
            }
            if (hit_count > 0) {
                return (((1.10 * hit_count) / union) + priority).toFixed(2);
            }
        }
        return 0.0;
    }
    /* Fuzzy Search, inspiration from http://jsfiddle.net/ezwv3uuc/ */

    /**
     *
     * @param Object object from list.
     * @param String query / keyword to search for.
     */
    addPriority(object, query) {
        let priorityList = [];
        for (let key in object) {
            let priority = 0;
            if (object.hasOwnProperty(key)) {
                if (object[key] !== null) {
                    if (object[key].toLowerCase().includes(query.toLowerCase())) {
                        priority += this.checkStringScore(query, object[key], key);
                    }
                }
            }
            priorityList.push([key, priority]);
        }
        priorityList = priorityList.sort(function(a, b) {
            return b[1] - a[1];
        });

        if (priorityList[0][1] > 0) {
            return Object.assign({}, object, {"Priority": priorityList[0][1]});
        }
        return null;
    }

    /**
     *
     * @param String query you want to search for.
     * @param Int limit number of room being returned.
     */
    searchPriority(query, limit) {
        let newList = [];
        for (let object of this.list) {
            let value = this.addPriority(object, query);
            if (value !== null) {
                newList.push(value);
            }
        }

        newList.sort(function(a, b) {
            return b.Priority - a.Priority;
        });

        return this.limit(newList, limit);
    }
}

export default Data;
