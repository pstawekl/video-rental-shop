export class StringUtils {
    public static ReplaceBlackChars(value: string): string {
        if (typeof value !== 'string') {
          throw new Error('Wartość musi być stringiem.');
        }
        
        return value.replace(/['";]/g, '');
      };
}