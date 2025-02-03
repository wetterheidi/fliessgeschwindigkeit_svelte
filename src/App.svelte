<script>
	import { FlowCalculator } from './classes/FlowCalculator.class';

	let strickler = 0; // Declare strickler


	let gefaelle = 0; // Declare gefaelle
	let message = "";
	let breiteOben = 10; // Declare breiteOben
	let breiteUnten = 5; // Declare breiteUnten
	let hoehe = 1; // Declare hoehe
	let xWert = 0; // Declare xWert
	let querschnittEingabe = 50; // Declare querschnittEingabe
	let umfangEingabe = 50; // Declare umfangEingabe
	let hoehenunterschied = 0; // Declare hoehenunterschied
	let laengeFluss = 0; // Declare laengeFluss
	let gefaelleOption = "eingeben"; // Declare gefaelleOption

	// Variable to store the selected value
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
	// Stricklerindizes für die verschiednen Gewässerkategorien zuordnen
	$: {
		if (selectedKategory === "Bach") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					if (strickler === 0) strickler = 30;
					break;
				case 1:
					if (strickler === 0) strickler = 22.5;
					break;
				case 2:
					if (strickler === 0) strickler = 15;
					break;
				case 3:
					if (strickler === 0) strickler = 22.5;
					break;
				case 4:
					if (strickler === 0) strickler = 15;
					break;
				case 5:
					if (strickler === 0) strickler = 30;
					break;
				case 6:
					if (strickler === 0) strickler = 90;
					break;
				case 7:
					if (strickler === 0) strickler = 60;
					break;
				case 8:
					if (strickler === 0) strickler = 75;
					break;
				case 9:
					if (strickler === 0) strickler = 50;
					break;
				case 10:
					if (strickler === 0) strickler = 40;
					break;
				case 11:
					if (strickler === 0) strickler = 40;
					break;
			}
		} else if (selectedKategory === "Fluss") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					if (strickler === 0) strickler = 35;
					break;
				case 1:
					if (strickler === 0) strickler = 30;
					break;
				case 2:
					if (strickler === 0) strickler = 25;
					break;
				case 3:
					if (strickler === 0) strickler = 20;
					break;
				case 4:
					if (strickler === 0) strickler = 90;
					break;
				case 5:
					if (strickler === 0) strickler = 60;
					break;
				case 6:
					if (strickler === 0) strickler = 50;
					break;
				case 7:
					if (strickler === 0) strickler = 40;
					break;
				case 8:
					if (strickler === 0) strickler = 40;
					break;
			}
		} else if (selectedKategory === "Kanal") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					if (strickler === 0) strickler = 40;
					break;
				case 1:
					if (strickler === 0) strickler = 30;
					break;
				case 2:
					if (strickler === 0) strickler = 90;
					break;
				case 3:
					if (strickler === 0) strickler = 60;
					break;
				case 4:
					if (strickler === 0) strickler = 70;
					break;
				case 5:
					if (strickler === 0) strickler = 75;
					break;
			}
		} else if (selectedKategory === "Sonstige Fläche") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0:
					if (strickler === 0) strickler = 90;
					break;
				case 1:
					if (strickler === 0) strickler = 60;
					break;
				case 2:
					if (strickler === 0) strickler = 70;
					break;
				case 3:
					if (strickler === 0) strickler = 75;
					break;
				case 4:
					if (strickler === 0) strickler = 50;
					break;
				case 5:
					if (strickler === 0) strickler = 35;
					break;
			}
		} else {
			strickler = 0;
			//Fehlermeldung
			console.log("Error");
		}
	}

	//Querschnitte definieren und ein-/ausblenden je nach  Bedarf
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
		imageSrc = "/fliessgeschwindigkeit_svelte/Rechteck_Ausschnitt.png";
		breiteVisible = true;
		hoeheVisible = true;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
		imageSrc = "/fliessgeschwindigkeit_svelte/GleichschenkligesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Allgemeines Trapez") {
		imageSrc = "/fliessgeschwindigkeit_svelte/AllgemeinesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = true;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Rohrsegment") {
		imageSrc = "/fliessgeschwindigkeit_svelte/Rohrsegement_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = false;
		xVisible = false;
		querschnittEingabeVisible = false;
		umfangEingabeVisible = false;
	} else if (selectedQuerschnitt === "Benutzerdefiniert") {
		imageSrc = "/fliessgeschwindigkeit_svelte/Benutzerdefiniert.png";
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

	

	$: {
		//Ergebnisse bereitstellen und fehlende Eingaben abfangen
		if (strickler === 0 || gefaelle === 0) {
			flaeche = 0;
			umfang = 0;
			geschwindigkeitms = 0;
			geschwindigkeitkt = 0;
			durchfluss = 0;
			message =
				"Bitte geben Sie einen Stricklerindex und ein Gefälle ein.";
		} else {
			message = "";
		}

		let result;
		if (selectedQuerschnitt === "Rechteck") {
			result = FlowCalculator.rechteck(breiteOben, hoehe, gefaelle, strickler);
		} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
			result = FlowCalculator.gleichschenkligesTrapez(
				breiteOben,
				breiteUnten,
				hoehe,
				gefaelle,
				strickler,
			);
		} else if (selectedQuerschnitt === "Allgemeines Trapez") {
			result = FlowCalculator.allgemeinesTrapez(
				breiteOben,
				breiteUnten,
				xWert,
				hoehe,
				gefaelle,
				strickler,
			);
		} else if (selectedQuerschnitt === "Rohrsegment") {
			result = FlowCalculator.rohrsegment(breiteOben, hoehe, gefaelle, strickler);
		} else if (selectedQuerschnitt === "Benutzerdefiniert") {
			result = FlowCalculator.benutzerdefiniert(gefaelle, strickler, querschnittEingabe, umfangEingabe);
		}

		if (result) {
			flaeche = parseFloat(result.querschnittsflaeche.toFixed(1));
			umfang = parseFloat(result.benetzterUmfang.toFixed(1));
			geschwindigkeitms = parseFloat(result.vMittel.toFixed(1));
			geschwindigkeitkt = parseFloat(
				((result.vMittel * 3.6) / 1.852).toFixed(1),
			);
			durchfluss = parseFloat(result.volMenge.toFixed(1));
		}
	}

	$: {
		if (gefaelleOption === "berechnen") {
			gefaelle = FlowCalculator.gefaelleRechnen(hoehenunterschied, laengeFluss);
			gefaelle = parseFloat(gefaelle.toFixed(2));
		}
	}
</script>

<main>
	<div class="form-group">
		<img
			src="/fliessgeschwindigkeit_svelte/GeoInfoSim.png"
			alt="Logo"
			style="width: 150px; height: 150px;"
		/>
		<h1>Berechnung der Fliessgeschwindigkeit</h1>
	</div>

	<hr />
	<h2>Eingaben</h2>
	{#if message}
		<p class="message">{message}</p>
	{/if}

	<div class="form-group">
		<label for="cmbkategorie"><strong>Kategorie</strong></label>
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
		<label for="strickler"><strong>Stricklerindex</strong></label>
		<input
			id="strickler"
			type="number"
			bind:value={strickler}
			placeholder="35"
		/>
	</div>
	<div class="form-group small-margin">
		<label for="gefaelle"><strong>Gefälle</strong></label>
		<label>
			<input
				type="radio"
				name="gefaelleOption"
				value="eingeben"
				bind:group={gefaelleOption}
			/>
			eingeben
		</label>
		<label>
			<input
				type="radio"
				name="gefaelleOption"
				value="berechnen"
				bind:group={gefaelleOption}
			/>
			berechnen
		</label>
	</div>
	{#if gefaelleOption === "eingeben"}
		<div class="form-group small-margin">
			<input
				id="gefaelle"
				type="number"
				bind:value={gefaelle}
				placeholder="1"
			/>
			<label for="prozent">% </label>
		</div>
	{:else if gefaelleOption === "berechnen"}
		<div class="form-group small-margin">
			<label for="hoehenunterschied">Höhenunterschied</label>
			<input
				id="hoehenunterschied"
				type="number"
				bind:value={hoehenunterschied}
				placeholder="1"
			/>
			<label for="meter">m Länge des Flusses</label>
			<input
				id="laengeFluss"
				type="number"
				bind:value={laengeFluss}
				placeholder="1"
			/>
			<label for="meter">m</label>
		</div>
	{/if}

	<div class="form-group">
		<label for="querschnitt"><strong>Flußquerschnitt</strong></label>
		<select id="cmbquerschnitt" bind:value={selectedQuerschnitt}>
			{#each querschnitte as querschnitt}
				<option value={querschnitt}>{querschnitt}</option>
			{/each}
		</select>
	</div>

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
						<input
							id="breiteoben"
							type="number"
							bind:value={breiteOben}
							placeholder="50"
						/>
						<label for="breiteoben">m</label>
					</div>
				{/if}

				{#if breiteuntenVisible}
					<div class="form-group">
						<label for="breiteunten">b<sub>u</sub></label>
						<input
							id="breiteunten"
							type="number"
							bind:value={breiteUnten}
							placeholder="50"
						/>
						<label for="breiteunten">m</label>
					</div>
				{/if}

				{#if xVisible}
					<div class="form-group">
						<label for="x">x</label>
						<input
							id="x"
							type="number"
							bind:value={xWert}
							placeholder="50"
						/>
						<label for="x">m</label>
					</div>
				{/if}

				{#if querschnittEingabeVisible}
					<div class="form-group">
						<label for="querschnittEingabe">Fläche</label>
						<input
							id="querschnittEingabe"
							type="number"
							placeholder="50"
							bind:value={querschnittEingabe}
						/>
						<label for="querschnittEingabe">m<sup>2</sup></label>
					</div>
				{/if}

				{#if umfangEingabeVisible}
					<div class="form-group">
						<label for="umfangEingabe">Umfang</label>
						<input
							id="umfangEingabe"
							type="number"
							placeholder="50"
							bind:value={umfangEingabe}
						/>
						<label for="umfangEingabe">m</label>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<hr />
	<h2>Ergebnisse</h2>
	<div class="table-container">
		<table class="form-table">
			<tr>
				<td>
					<label for="flaeche">Querschnittsfläche</label>
				</td>
				<td>
					<span id="flaeche">{flaeche}</span>
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
					<span id="umfang">{umfang}</span>
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
					<span id="geschwindigkeitms">{geschwindigkeitms}</span>
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
					<span id="geschwindigkeitkt">{geschwindigkeitkt}</span>
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
					<span id="durchfluss">{durchfluss}</span>
				</td>
				<td>
					<label for=""> m<sup>3</sup>/s</label>
				</td>
			</tr>
		</table>
	</div>
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
		margin-bottom: 0.2rem;
		padding: 0.2rem;
	}

	.form-group.small-margin {
		margin-bottom: 0.5rem; /* Reduzierter Abstand */
	}

	div {
		margin-bottom: 1rem;
	}

	label {
		margin-right: 0.5rem;
		font-size: 1rem;
	}

	input {
		padding: 0.2rem;
		font-size: 1rem;
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}

	p {
		margin-top: 1rem;
		font-size: 1.2rem;
	}

	.message {
		color: red;
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
		border: 1px solid black; /* Add border to the table */
	}

	.form-table td {
		padding: 0.2rem;
		border: 1px solid black; /* Add border to table cells */
	}

	.form-table label {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}
</style>
