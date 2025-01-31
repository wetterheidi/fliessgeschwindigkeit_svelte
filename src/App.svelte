<script lang="ts">
	let strickler = 0;
	let gefaelle = 0;
	let querschnitt = "";
	let name = "";
	let age = "";
	let message = "";
	let breiteOben = 50;
	let hoehe = 50;
	let xWert = 0; // Declare xWert
	let querschnittEingabe = 50; // Declare querschnittEingabe
	let umfangEingabe = 50; // Declare umfangEingabe

	// Define an array of options for the dropdown
	let options = ["Option 1", "Option 2", "Option 3"];

	// Variable to store the selected value
	let selectedOption = options[0];
	let selectedQuerschnitt = "";
	let selectedBewuchs = "";
	let flaeche = 0;
	let umfang = 0;
	let geschwindigkeitms = 0;
	let geschwindigkeitkt = 0;
	let durchfluss = 0;

	//Kategorien des Fliessgewässers festlegen
	let kategories = ["Bach", "Fluss", "Kanal", "Sonstige Fläche"];
	let selectedKategory = kategories[1];

	//Bewuchs definieren
	$: bewuechse = [];
	$: if (selectedKategory === "Bach") {
		bewuechse = [
			"mäßiger Uferbewuchs",
			"üppiger Uferbewuchs",
			"verwachsen (Sträucher/Bäume)",
			"mit großen Steinen",
			"mit großen bewegten Steinen",
			"Waldgraben; wenig Bewuchs",
			"Betongerinne; neu/glatt",
			"Betongerinne; alt/rau",
			"Holzrinne",
			"Gerinne; gepflastert",
			"teils gepflastert, teils Wiese",
			"naturnahe Sole; Ufermauern",
		];
	} else if (selectedKategory === "Fluss") {
		bewuechse = [
			"mäßiger Uferbewuchs",
			"üppiger Uferbewuchs",
			"verwachsen (Sträucher/Bäume)",
			"mit großen Steinen",
			"mit großen bewegten Steinen",
			"Waldgraben; wenig Bewuchs",
			"Betongerinne; neu/glatt",
			"Betongerinne; alt/rau",
			"Gerinne; gepflastert",
			"teils gepflastert, teils Wiese",
			"naturnahe Sole; Ufermauern",
		];
	} else if (selectedKategory === "Kanal") {
		bewuechse = [
			"Erdkanal; geringer Uferbewuchs",
			"Erdkanal; üppiger Uferbewuchs",
			"Beton; neu/glatt",
			"Beton; alt/rau",
			"Ziegel",
			"Holz",
		];
	} else if (selectedKategory === "Sonstige Fläche") {
		bewuechse = [
			"Beton; neu/glatt",
			"Beton; alt/rau",
			"Asphalt",
			"Holz",
			"Erdboden; glatt",
			"Erdboden; rau",
			"Wiese; mittelhoch",
		];
	} else {
		//Fehlermeldung
		console.log("Error");
	}
	//$: selectedBewuchs = bewuechse[0];

	$: {
		if (selectedKategory === "Bach") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					strickler = 30;
					break;
				case 1:
					strickler = 22.5;
					break;
				case 2:
					strickler = 15;
					break;
				case 3:
					strickler = 22.5;
					break;
				case 4:
					strickler = 15;
					break;
				case 5:
					strickler = 30;
					break;
				case 6:
					strickler = 90;
					break;
				case 7:
					strickler = 60;
					break;
				case 8:
					strickler = 75;
					break;
				case 9:
					strickler = 50;
					break;
				case 10:
					strickler = 40;
					break;
				case 11:
					strickler = 40;
					break;
			}
		} else if (selectedKategory === "Fluss") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					strickler = 35;
					break;
				case 1:
					strickler = 30;
					break;
				case 2:
					strickler = 25;
					break;
				case 3:
					strickler = 20;
					break;
				case 4:
					strickler = 90;
					break;
				case 5:
					strickler = 60;
					break;
				case 6:
					strickler = 50;
					break;
				case 7:
					strickler = 40;
					break;
				case 8:
					strickler = 40;
					break;
			}
		} else if (selectedKategory === "Kanal") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					strickler = 40;
					break;
				case 1:
					strickler = 30;
					break;
				case 2:
					strickler = 90;
					break;
				case 3:
					strickler = 60;
					break;
				case 4:
					strickler = 70;
					break;
				case 5:
					strickler = 75;
					break;
			}
		} else if (selectedKategory === "Sonstige Fläche") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					strickler = 90;
					break;
				case 1:
					strickler = 60;
					break;
				case 2:
					strickler = 70;
					break;
				case 3:
					strickler = 75;
					break;
				case 4:
					strickler = 50;
					break;
				case 5:
					strickler = 35;
					break;
			}
		} else {
			strickler = 0;
			//Fehlermeldung
			console.log("Error");
		}
	}

	//Querschnitte definieren
	let querschnitte = [
		"Rechteck",
		"Gleichschenkliges Trapez",
		"Allgemeines Trapez",
		"Rohrsegment",
		"Benutzerdefiniert",
	];
	selectedQuerschnitt = querschnitte[0];

	$: imageSrc = "";
	$: breiteVisible = false;
	$: hoeheVisible = false;
	$: breiteobenVisible = false;
	$: breiteuntenVisible = false;
	$: xVisible = false;
	$: querschnittEingabeVisible = false;
	$: umfangEingabeVisible = false;

	$: if (selectedQuerschnitt === "Rechteck") {
		imageSrc = "/Rechteck_Ausschnitt.png";
		breiteVisible = true;
		hoeheVisible = true;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
		imageSrc = "/GleichschenkligesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Allgemeines Trapez") {
		imageSrc = "/AllgemeinesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = true;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Rohrsegment") {
		imageSrc = "/Rohrsegement_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = false;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Benutzerdefiniert") {
		imageSrc = "/Benutzerdefiniert.png";
		breiteVisible = false;
		hoeheVisible = false;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
		querschnittEingabeVisible = true;
		umfangEingabeVisible = true;
	} else {
		imageSrc = "";
		breiteVisible = false;
		hoeheVisible = false;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
	}

	function fliessgeschwindigkeit(A, gef, U, kSt) {
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

	function rechteck(breite, hoehe, gefaelle, strickler) {
		const querschnittsflaeche = breite * hoehe;
		const benetzterUmfang = 2 * (breite + hoehe);
		const { vMittel, volMenge } = fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	function gleichschenkligesTrapez(
		breiteOben,
		breiteUnten,
		hoehe,
		gefaelle,
		strickler,
	) {
		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
		const benetzterUmfang =
			breiteUnten +
			2 * (hoehe ^ (2 + (breiteOben - breiteUnten) / 2) ^ 2 ^ (1 / 2));
		const { vMittel, volMenge } = fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	function allgemeinesTrapez(
		breiteOben,
		breiteUnten,
		xWert,
		hoehe,
		gefaelle,
		strickler,
	) {
		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
		const benetzterUmfang =
			(breiteUnten +
				(hoehe ^ (2 + (breiteOben - breiteUnten - xWert)) ^ 2)) ^
			(1 / 2 + (hoehe ^ (2 + xWert) ^ 2)) ^
			(1 / 2);
		const { vMittel, volMenge } = fliessgeschwindigkeit(
			querschnittsflaeche,
			gefaelle,
			benetzterUmfang,
			strickler,
		);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	function rohrsegment(breite, hoehe, gefaelle, strickler) {
		const radius = (hoehe / 2 + breiteOben) ^ (2 / (8 * hoehe));
		const winkel = 2 * Math.asin(breiteOben / (2 * radius));
		const querschnittsflaeche = (0.5 * radius) ^ (2 * (winkel - Math.sin(winkel)));
		const benetzterUmfang = winkel * radius;
		const { vMittel, volMenge } = fliessgeschwindigkeit(querschnittsflaeche,gefaelle,benetzterUmfang,strickler);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	function benutzerdefiniert(gefaelle, strickler) {
		const querschnittsflaeche = querschnittEingabe;
		const benetzterUmfang = umfangEingabe;
		const { vMittel, volMenge } = fliessgeschwindigkeit(querschnittsflaeche,gefaelle,benetzterUmfang,strickler);
		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
	}

	function handleBerechnen() {
		message = `Außer das Gefälle hinschreiben ${gefaelle} kann ich noch gar nix!`;
		if (strickler === 0) {
			alert("Erst Stricklerbeiwert eingeben!");
			return;
		}
		if (gefaelle === 0) {
			alert("Erst Gefälle eingeben!");
			return;
		}

		//dann ausrechnen!
		if (selectedQuerschnitt === "Rechteck") {
			const result = rechteck(breiteOben, hoehe, gefaelle, strickler);
			if (result) {
				flaeche = result.querschnittsflaeche;
				umfang = result.benetzterUmfang;
				geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
				geschwindigkeitkt = parseFloat(
					((result.vMittel * 3.6) / 1.852).toFixed(1),
				);
				durchfluss = parseFloat(result.volMenge.toFixed(1));
				//alert(`Die Fläche des Rechtecks beträgt: ${result.querschnittsflaeche} m²`);
			}
		} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
			const result = gleichschenkligesTrapez(
				breiteOben,
				breiteOben,
				hoehe,
				gefaelle,
				strickler,
			);
			if (result) {
				flaeche = result.querschnittsflaeche;
				umfang = result.benetzterUmfang;
				geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
				geschwindigkeitkt = parseFloat(
					((result.vMittel * 3.6) / 1.852).toFixed(1),
				);
				durchfluss = parseFloat(result.volMenge.toFixed(1));
			}
		} else if (selectedQuerschnitt === "Allgemeines Trapez") {
			const result = allgemeinesTrapez(
				breiteOben,
				breiteOben,
				xWert,
				hoehe,
				gefaelle,
				strickler,
			);
			if (result) {
				flaeche = result.querschnittsflaeche;
				umfang = result.benetzterUmfang;
				geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
				geschwindigkeitkt = parseFloat(
					((result.vMittel * 3.6) / 1.852).toFixed(1),
				);
				durchfluss = parseFloat(result.volMenge.toFixed(1));
			}
		} else if (selectedQuerschnitt === "Rohrsegment") {
			const result = rohrsegment(breiteOben, hoehe, gefaelle, strickler);
			if (result) {
				flaeche = result.querschnittsflaeche;
				umfang = parseFloat(result.benetzterUmfang.toFixed(1));
				geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
				geschwindigkeitkt = parseFloat(
					((result.vMittel * 3.6) / 1.852).toFixed(1),
				);
				durchfluss = parseFloat(result.volMenge.toFixed(1));
			}
		} else if (selectedQuerschnitt === "Benutzerdefiniert") {
			const result = benutzerdefiniert(gefaelle, strickler);
			if (result) {
				flaeche = result.querschnittsflaeche;
				umfang = parseFloat(result.benetzterUmfang.toFixed(1));
				geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
				geschwindigkeitkt = parseFloat(
					((result.vMittel * 3.6) / 1.852).toFixed(1),
				);
				durchfluss = parseFloat(result.volMenge.toFixed(1));
			}
		} else {
			message = "Fehler!";
		}
	}
</script>

<main>
	<div class="form-group">
		<img src="/GeoInfoSim.png" alt="Logo" />
		<h1>Berechnung der Fliessgeschwindigkeit</h1>
	</div>

	<div class="form-group">
		<label for="cmbkategorie">Kategorie</label>
		<select id="cmbkategorie" bind:value={selectedKategory}>
			{#each kategories as kategory}
				<option value={kategory}>{kategory}</option>
			{/each}
		</select>
		<select id="cmbbewuchs" bind:value={selectedBewuchs}>
			{#each bewuechse as bewuchs}
				<option value={bewuchs}>{bewuchs}</option>
			{/each}
		</select>
	</div>
	<div class="form-group">
		<label for="strickler">Stricklerindex</label>
		<input
			id="strickler"
			type="number"
			bind:value={strickler}
			placeholder="35"
		/>
		<label for="gefaelle">Gefälle</label>
		<input
			id="gefaelle"
			type="number"
			bind:value={gefaelle}
			placeholder="1"
		/>
		<label for="prozent">%</label>
	</div>

	<div class="form-group">
		<label for="querschnitt">Flußquerschnitt</label>
		<select id="cmbquerschnitt" bind:value={selectedQuerschnitt}>
			{#each querschnitte as querschnitt}
				<option value={querschnitt}>{querschnitt}</option>
			{/each}
		</select>
	</div>

	<hr />

	{#if imageSrc}
		<div class="image-input-group">
			<img src={imageSrc} alt="Querschnitt Bild" />
			<div class="input-fields">
				{#if breiteVisible}
					<div class="form-group">
						<label for="breite">b</label>
						<input
							id="breite"
							type="number"
							bind:value={breiteOben}
							placeholder="50"
						/>
						<label for="breite">m</label>
					</div>
				{/if}

				{#if hoeheVisible}
					<div class="form-group">
						<label for="hoehe">h</label>
						<input
							id="hoehe"
							type="number"
							bind:value={hoehe}
							placeholder="50"
						/>
						<label for="hoehe">m</label>
					</div>
				{/if}

				{#if breiteobenVisible}
					<div class="form-group">
						<label for="breiteoben">b<sub>o</sub></label>
						<input id="breiteoben" type="number" placeholder="50" />
						<label for="breiteoben">m</label>
					</div>
				{/if}

				{#if breiteuntenVisible}
					<div class="form-group">
						<label for="breiteunten">b<sub>u</sub></label>
						<input
							id="breiteunten"
							type="number"
							placeholder="50"
						/>
						<label for="breiteunten">m</label>
					</div>
				{/if}

				{#if xVisible}
					<div class="form-group">
						<label for="x">x</label>
						<input id="x" type="number" placeholder="50" />
						<label for="x">m</label>
					</div>
				{/if}

				{#if querschnittEingabeVisible}
					<div class="form-group">
						<label for="querschnittEingabe">Fläche</label>
						<input id="querschnittEingabe" type="number" placeholder="50" bind:value={querschnittEingabe} />
						<label for="querschnittEingabe">m<sup>2</sup></label>
					</div>
				{/if}

				{#if umfangEingabeVisible}
					<div class="form-group">
						<label for="umfangEingabe">Umfang</label>
						<input id="umfangEingabe" type="number" placeholder="50" bind:value={umfangEingabe} />
						<label for="umfangEingabe">m</label>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<hr />

	<div class="table-container">
		<table class="form-table">
			<tr>
				<td>
					<label for="flaeche">Querschnittsfläche</label>
				</td>
				<td>
					<input
						id="flaeche"
						type="integer"
						bind:value={flaeche}
						placeholder="1"
					/>
				</td>
				<td>
					<label for="">m<sup>2</sup></label>
				</td>
			</tr>
			<tr>
				<td>
					<label for="umfang">Benetzter Umfang</label>
				</td>
				<td>
					<input
						id="umfang"
						type="integer"
						bind:value={umfang}
						placeholder="1"
						size="5"
					/>
				</td>
				<td>
					<label for="">m</label>
				</td>
			</tr>
			<tr>
				<td>
					<label for="geschwindigkeit">Geschwindigkeit</label>
				</td>
				<td>
					<input
						id="geschwindigkeitms"
						type="integer"
						bind:value={geschwindigkeitms}
						placeholder="1"
					/>
				</td>
				<td>
					<label for=""> m/s</label>
				</td>
			</tr>
			<tr>
				<td>
					<label for="geschwindigkeitkt">Geschwindigkeit</label>
				</td>
				<td>
					<input
						id="geschwindigkeitkt"
						type="integer"
						bind:value={geschwindigkeitkt}
						placeholder="1"
					/>
				</td>
				<td>
					<label for="">kt</label>
				</td>
			</tr>
			<tr>
				<td>
					<label for="durchfluss">Durchfluss</label>
				</td>
				<td>
					<input
						id="durchfluss"
						type="integer"
						bind:value={durchfluss}
						placeholder="1"
					/>
				</td>
				<td>
					<label for=""> m<sup>3</sup>/s</label>
				</td>
			</tr>
		</table>
	</div>

	<hr />

	<button on:click={handleBerechnen}>Berechnen</button>

	{#if message}
		<p>{message}</p>
	{/if}

	<p>Selected option: {selectedQuerschnitt}</p>
</main>

<style>
	main {
		margin: 0 auto;
		max-width: 600px;
		padding: 1rem;
		text-align: center;
	}

	.form-group {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		padding: 0.2rem;
	}

	div {
		margin-bottom: 1rem;
	}

	label {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}

	input {
		padding: 0.2rem;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
	}

	p {
		margin-top: 1rem;
		font-size: 1.2rem;
	}

	.image-input-group {
		display: flex;
		align-items: center;
		margin-left: 20%;
	}

	.input-fields {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-left: 1rem;
	}

	.input-fields .form-group {
		display: flex;
		align-items: center;
		margin-bottom: 0.2rem;
		width: 100%;
	}

	.input-fields .form-group label {
		width: 50px;
	}

	.input-fields .form-group input {
		flex: 1;
	}

	img {
		max-width: 100%;
		height: 100px;
	}

	input[type="integer"] {
		width: 8ch;
	}

	input[type="number"] {
		width: 8ch;
	}

	.table-container {
		display: flex;
		justify-content: center;
	}

	.form-table {
		width: flex;
		border-collapse: collapse;
		margin-bottom: 0.2rem;
	}

	.form-table td {
		padding: 0.2rem;
	}

	.form-table label {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}

	.form-table input {
		padding: 0.2rem;
		font-size: 1rem;
		width: 8ch;
	}
</style>
