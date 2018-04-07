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
        if(limit !== null) {
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
            if(room.Salsnr !== null) {
                if(room.Salsnr.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if(room.Salsnamn !== null) {
                if(room.Salsnamn.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if(room.Lat !== null) {
                if(room.Lat.includes(keyword)) {
                    return room;
                }
            }
            if(room.Long !== null) {
                if(room.Long.includes(keyword)) {
                    return room;
                }
            }
            if(room.Ort !== null) {
                if(room.Ort.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if(room.Hus !== null) {
                if(room.Hus.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if(room.Våning !== null) {
                if(room.Våning.includes(keyword)) {
                    return room;
                }
            }
            if(room.Typ !== null) {
                if(room.Typ.toLowerCase().includes(keyword.toLowerCase())) {
                    return room;
                }
            }
            if(room.Storlek !== null) {
                if(room.Storlek.includes(keyword)) {
                    return room;
                }
            }
        })

        return this.limit(newList, limit);
    }
}

export default Data;
