<script>
	let strickler = 0;
	let gefaelle = 0;
	let querschnitt = "";
	let name = "";
	let age = "";
	let message = "";

	function handleBerechnen() {
		message = `Außer das Gefälle hinschreiben ${gefaelle} kann ich noch gar nix!`;
	}

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
		<img src={imageSrc} alt="Querschnitt Bild" />
	{/if}

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
		<input id="umfang" type="integer" bind:value={umfang} placeholder="1" />
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

	<h1>Simple Dropdown Box in Svelte</h1>

	<div>
		<label for="dropdown">Choose an option:</label>
		<select id="dropdown" bind:value={selectedOption}>
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>

	<p>Selected option: {selectedOption}</p>
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

	img {
		max-width: 100%;
		height: 100px;
	}
</style>
