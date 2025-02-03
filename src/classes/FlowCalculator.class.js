export class FlowCalculator {
    static fliessgeschwindigkeit(A, gef, U, kSt) {
		//Fließgeschwindigkeit mit Hilfe der Mannig-Stricklerformel berechnen
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

	static rechteck(breite, hoehe, gefaelle, strickler) {
		//Rechteckquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
		const querschnittsflaeche = breite * hoehe;
		const benetzterUmfang = breite + 2 * hoehe;
		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	static gleichschenkligesTrapez(
		//Trapezquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
		breiteOben,
		breiteUnten,
		hoehe,
		gefaelle,
		strickler,
	) {
		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
		const benetzterUmfang =
			breiteUnten +
			2 *
				((hoehe ** 2 + Math.abs(breiteOben - breiteUnten) / 2) ** 2) **
					(1 / 2);
		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	static allgemeinesTrapez(
		//Trapezquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
		breiteOben,
		breiteUnten,
		xWert,
		hoehe,
		gefaelle,
		strickler,
	) {
		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
		const seite1 = Math.sqrt(
			(breiteOben - breiteUnten - xWert) ** 2 + hoehe ** 2,
		);
		const seite2 = Math.sqrt(xWert ** 2 + hoehe ** 2);
		const benetzterUmfang = breiteUnten + seite1 + seite2;
		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	static rohrsegment(breite, hoehe, gefaelle, strickler) {
		//Rohrsegmentquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
		const radius = hoehe / 2 + breite ** 2 / (8 * hoehe);
		const winkel = 2 * Math.asin(breite / (2 * radius));
		const querschnittsflaeche =
			0.5 * radius ** 2 * (winkel - Math.sin(winkel));
		const benetzterUmfang = winkel * radius;
		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	static benutzerdefiniert(gefaelle, strickler, querschnittEingabe, umfangEingabe) {
		//Benutzerdefinierten Querschnitt, benetzten Umfang auslesen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
		const querschnittsflaeche = querschnittEingabe;
		const benetzterUmfang = umfangEingabe;
		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	static gefaelleRechnen(hoehenunterschied, laengeFluss) {
		//Gefälle berechnen
		if (hoehenunterschied === 0 || laengeFluss === 0) {
			return 0;
		} else {
			//const gefaelle =(hoehenunterschied ** 2 /(laengeFluss ** 2 - hoehenunterschied ** 2) ** 0.5) *100;
			const gefaelle = (hoehenunterschied / laengeFluss) * 100;
			return parseFloat(gefaelle.toFixed(2));
		}
	}
}
