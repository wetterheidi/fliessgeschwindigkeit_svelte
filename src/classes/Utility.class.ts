export class Utility {

  static Fliessgeschwindigkeit(A: number, gef: number, U: number, kSt: number): { vMittel: number, volMenge: number } {
    try {
      // Hydraulischer Radius
      const R = A / U;

      // Formel Mittlere Fließgeschwindigkeit nach Gauckler-Manning-Strickler
      const vMittel = kSt * Math.pow(R, 2 / 3) * Math.sqrt(gef / 100);

      // Durchflussmenge
      const volMenge = vMittel * A;

      return { vMittel, volMenge };

    } catch (ex) {
      console.error(ex.message);
      throw ex; // Rethrow the exception for further handling
    }
  }

  static rechteck(breiteOben: number, hoehe: number, gefaelle: number, stricklerBeiwert: number): void {
    let benetzterUmfang: number;
    let querschnittsflaeche: number;

    try {
        if (breiteOben === 0) {
            alert("Erst Breite oben eingeben!");
            return;
        }
        if (hoehe === 0) {
            alert("Erst Höhe eingeben!");
            return;
        }

        // benetzer Umfang ausrechnen
        benetzterUmfang = 2 * hoehe + breiteOben;
        console.log(`Benetzter Umfang: ${benetzterUmfang}`);

        // Querschnittsfläche ausrechnen
        querschnittsflaeche = breiteOben * hoehe;
        console.log(`Querschnittsfläche: ${querschnittsflaeche}`);

        // Geschwindigkeit und Durchflussmenge ausrechnen
        const { vMittel, volMenge } = this.Fliessgeschwindigkeit(querschnittsflaeche, gefaelle, benetzterUmfang, stricklerBeiwert);
        console.log(`Geschwindigkeit: ${vMittel} m/s`);
        console.log(`Durchflussmenge: ${volMenge} m³/s`);

    } catch (ex) {
        alert(ex.message);
        return;
    }
  }
}