import {Constantes} from "@/lib/base/util/Constantes";

class Pagination {
	
	skip:any;
    limit:any;

    constructor() {
        this.skip=0
        this.limit=Constantes.LIMIT
    }

    clone(){
        return new Pagination()
    }

    copy(pagination0:Pagination){
        this.skip=pagination0.skip
        this.limit=pagination0.limit
    }
}

export {Pagination};