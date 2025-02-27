class EnvironmentConfig {
    public static readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4200';
    
    public static getFileUrl(filename: string): string {
        return `${this.BACKEND_URL}/uploads/${filename}`;
    }
}

export default EnvironmentConfig;