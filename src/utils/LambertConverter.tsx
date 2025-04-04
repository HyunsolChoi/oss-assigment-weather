export class LambertConverter {
    static NX = 149;
    static NY = 253;

    private map_param: LamcParameter;

    constructor() {
        this.map_param = new LamcParameter();
    }

    private map_conv(lon: number, lat: number): [number, number, number, number] {
        if (this.map_param.first === 0) {
            this.map_param.initialize();
        }

        const [x, y] = this.lamcproj(lon, lat);
        return [lon, lat, Math.floor(x + 1.5), Math.floor(y + 1.5)];
    }

    private lamcproj(lon: number, lat: number): [number, number] {
        const PI = Math.PI;
        const DEGRAD = PI / 180.0;

        let ra = Math.tan(PI * 0.25 + (lat * DEGRAD * 0.5));
        ra = this.map_param.re * this.map_param.sf / Math.pow(ra, this.map_param.sn);

        let theta = lon * DEGRAD - this.map_param.olon_rad;
        if (theta > PI) theta -= 2.0 * PI;
        if (theta < -PI) theta += 2.0 * PI;
        theta *= this.map_param.sn;

        const x = ra * Math.sin(theta) + this.map_param.xo;
        const y = this.map_param.ro - ra * Math.cos(theta) + this.map_param.yo;

        return [x, y];
    }

    public convert(lon: number, lat: number): { nx: number; ny: number } {
        const [, , x, y] = this.map_conv(lon, lat);
        return { nx: x, ny: y };
    }
}

class LamcParameter {
    Re = 6371.00877;
    grid = 5.0;
    slat1 = 30.0;
    slat2 = 60.0;
    olon = 126.0;
    olat = 38.0;
    xo = 210 / this.grid;
    yo = 675 / this.grid;
    first = 0;

    // 내부 계산용
    re!: number;
    slat1_rad!: number;
    slat2_rad!: number;
    olon_rad!: number;
    olat_rad!: number;
    sn!: number;
    sf!: number;
    ro!: number;

    initialize(): void {
        const PI = Math.PI;
        const DEGRAD = PI / 180.0;

        this.re = this.Re / this.grid;
        this.slat1_rad = this.slat1 * DEGRAD;
        this.slat2_rad = this.slat2 * DEGRAD;
        this.olon_rad = this.olon * DEGRAD;
        this.olat_rad = this.olat * DEGRAD;

        let sn = Math.tan(PI * 0.25 + this.slat2_rad * 0.5) / Math.tan(PI * 0.25 + this.slat1_rad * 0.5);
        sn = Math.log(Math.cos(this.slat1_rad) / Math.cos(this.slat2_rad)) / Math.log(sn);
        this.sn = sn;

        let sf = Math.tan(PI * 0.25 + this.slat1_rad * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(this.slat1_rad) / sn;
        this.sf = sf;

        let ro = Math.tan(PI * 0.25 + this.olat_rad * 0.5);
        ro = this.re * sf / Math.pow(ro, sn);
        this.ro = ro;

        this.first = 1;
    }
}