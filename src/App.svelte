<script lang="ts">
	let strickler = 0;
	let gefaelle = 0;
	let querschnitt = "";
	let name = "";
	let age = "";
	let message = "";


	// Define an array of options for the dropdown
	let options = ["Option 1", "Option 2", "Option 3"];

	// Variable to store the selected value
	let selectedOption = options[0];
	let selectedQuerschnitt = "";
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
	$: selectedBewuchs = bewuechse[0];

	$: {
		if (selectedKategory === "Bach") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0: strickler = 30; break;
				case 1: strickler = 22.5; break;
				case 2: strickler = 15; break;
				case 3: strickler = 22.5; break;
				case 4: strickler = 15; break;
				case 5: strickler = 30; break;
				case 6: strickler = 90; break;
				case 7: strickler = 60; break;
				case 8: strickler = 75; break;
				case 9: strickler = 50; break;
				case 10: strickler = 40; break;
				case 11: strickler = 40; break;
			}
		} else if (selectedKategory === "Fluss") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0: strickler = 35; break;
				case 1: strickler = 30; break;
				case 2: strickler = 25; break;
				case 3: strickler = 20; break;
				case 4: strickler = 90; break;
				case 5: strickler = 60; break;
				case 6: strickler = 50; break;
				case 7: strickler = 40; break;
				case 8: strickler = 40; break;
			}
		} else if (selectedKategory === "Kanal") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0: strickler = 40; break;
				case 1: strickler = 30; break;
				case 2: strickler = 90; break;
				case 3: strickler = 60; break;
				case 4: strickler = 70; break;
				case 5: strickler = 75; break;
			}
		} else if (selectedKategory === "Sonstige Fläche") {
			switch (bewuechse.indexOf(selectedBewuchs)) {
				case 0: strickler = 90; break;
				case 1: strickler = 60; break;
				case 2: strickler = 70; break;
				case 3: strickler = 75; break;
				case 4: strickler = 50; break;
				case 5: strickler = 35; break;
			}
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

	$: if (selectedQuerschnitt === "Rechteck") {
		imageSrc = "/Rechteck_Ausschnitt.png";
		breiteVisible = true;
		hoeheVisible = true;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
	} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
		imageSrc = "/GleichschenkligesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = false;
	} else if (selectedQuerschnitt === "Allgemeines Trapez") {
		imageSrc = "/AllgemeinesTrapez_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = true;
		xVisible = true;
	} else if (selectedQuerschnitt === "Rohrsegment") {
		imageSrc = "/Rohrsegement_Ausschnitt.png";
		breiteVisible = false;
		hoeheVisible = true;
		breiteobenVisible = true;
		breiteuntenVisible = false;
		xVisible = false;
	} else if (selectedQuerschnitt === "Benutzerdefiniert") {
		imageSrc = "/Benutzerdefiniert.png";
		breiteVisible = false;
		hoeheVisible = false;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
	} else {
		imageSrc = "";
		breiteVisible = false;
		hoeheVisible = false;
		breiteobenVisible = false;
		breiteuntenVisible = false;
		xVisible = false;
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
			//Tu was in Rechteck steht
		} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
			//Tu was in Gleichschenkliges Trapez steht
		} else if (selectedQuerschnitt === "Allgemeines Trapez") {
			//Tu was in Allgemeines Trapez steht
		} else if (selectedQuerschnitt === "Rohrsegment") {
			//Tu was in Rohrsegment steht
		} else if (selectedQuerschnitt === "Benutzerdefiniert") {
			//Tu was in Benutzerdefiniert steht
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
			type="integer"
			bind:value={strickler}
			placeholder="35"
		/>
		<label for="gefaelle">Gefälle</label>
		<input
			id="gefaelle"
			type="integer"
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

	{#if imageSrc}
		<div class="image-input-group">
			<img src={imageSrc} alt="Querschnitt Bild" />
			<div class="input-fields">
				{#if breiteVisible}
					<div class="form-group">
						<label for="breite">b</label>
						<input id="breite" type="number" placeholder="50" />
						<label for="breite">m</label>
					</div>
				{/if}

				{#if hoeheVisible}
					<div class="form-group">
						<label for="hoehe">h</label>
						<input id="hoehe" type="number" placeholder="50" />
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
						<input id="breiteunten" type="number" placeholder="50" />
						<label for="breiteunten">m</label>
					</div>
				{/if}

				{#if xVisible}
					<div class="form-group">
						<label for="x">h</label>
						<input id="x" type="number" placeholder="50" />
						<label for="x">m</label>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="form-group">
		<label for="flaeche">Querschnittsfläche</label>
		<input
			id="flaeche"
			type="integer"
			bind:value={flaeche}
			placeholder="1"
		/>
		<label for="">m<sup>2</sup></label>
	</div>
	<div class="form-group">
		<label for="umfang">Benetzter Umfang</label>
		<input id="umfang" type="integer" bind:value={umfang} placeholder="1" size="5" />
		<label for="">m</label>
	</div>
	<div class="form-group">
		<label for="geschwindigkeit">Geschwindigkeit</label>
		<input
			id="geschwindigkeitms"
			type="integer"
			bind:value={geschwindigkeitms}
			placeholder="1"
		/>
		<label for=""> m/s</label>
		<input
			id="geschwindigkeitkt"
			type="integer"
			bind:value={geschwindigkeitkt}
			placeholder="1"
		/>
		<label for="">kt</label>
	</div>
	<div class="form-group">
		<label for="durchfluss">Durchfluss</label>
		<input
			id="durchfluss"
			type="integer"
			bind:value={durchfluss}
			placeholder="1"
		/>
		<label for=""> m<sup>3</sup>/s</label>
	</div>
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
	}

	div {
		margin-bottom: 1rem;
	}

	label {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}

	input {
		padding: 0.5rem;
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
	}

	.input-fields {
		margin-left: 1rem;
	}

	.input-fields .form-group {
		margin-bottom: 0.2rem;
		display: flex;
		justify-content: center;
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
</style>
