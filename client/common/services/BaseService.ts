
interface IBaseService {
    fullUrlAPI: (path: string) => string
}

export class BaseService {
    private urlAPI: string

    constructor(urlAPI: string) {
        this.urlAPI = urlAPI
    }

    protected fullUrlAPI(path: string) {
        return `${this.urlAPI}${path}/`
    }
}