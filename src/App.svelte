<script>
	let name = "";
	let age = "";
	let message = "";

	function handleSubmit() {
		message = `Hello ${name}, you are ${age} years old.`;
	}

	// Define an array of options for the dropdown
	let options = ["Option 1", "Option 2", "Option 3"];

	// Variable to store the selected value
	let selectedOption = options[0];

	//Kategorien des Fliessgewässers festlegen
	let kategories = ["Bach", "Fluss", "Kanal", "Sonstige Fläche"];
	let selectedKategory = kategories[1];

	//Bewuchs definieren
	let bewuechse = [];
	if (selectedKategory === "Bach") {
		bewuechse = ["mäßiger Uferbewuchs", "üppiger Uferbewuchs", "verwachsen (Sträucher/Bäume)", "mit großen Steinen","mit großen bewegten Steinen","Waldgraben; wenig Bewuchs","Betongerinne; neu/glatt","Betongerinne; alt/rau","Holzrinne","Gerinne; gepflastert","teils gepflastert, teils Wiese","naturnahe Sole; Ufermauern"];
	} else if (selectedKategory === "Fluss") {
		bewuechse = ["mäßiger Uferbewuchs", "üppiger Uferbewuchs", "verwachsen (Sträucher/Bäume)", "mit großen Steinen","mit großen bewegten Steinen","Waldgraben; wenig Bewuchs","Betongerinne; neu/glatt","Betongerinne; alt/rau","Gerinne; gepflastert","teils gepflastert, teils Wiese","naturnahe Sole; Ufermauern"];
	} else if (selectedKategory === "Kanal") {
		bewuechse = ["Erdkanal; geringer Uferbewuchs", "Erdkanal; üppiger Uferbewuchs","Beton; neu/glatt","Beton; alt/rau","Ziegel","Holz"];
	} else if (selectedKategory === "Sonstige Fläche") {
		bewuechse = ["Beton; neu/glatt","Beton; alt/rau","Asphalt","Holz","Erdboden; glatt","Erdboden; rau","Wiese; mittelhoch"];
	} else {
		//Fehlermeldung
		console.log("Error");
	}

	
	let selectedBewuchs = bewuechse[0];

</script>

<main>
	<h1>Berechnung der Fliessgeschwindigkeit</h1>

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
	<div>
		<label for="name">Name:</label>
		<input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Enter your name"
		/>
	</div>

	<div>
		<label for="age">Age:</label>
		<input
			id="age"
			type="number"
			bind:value={age}
			placeholder="Enter your age"
		/>
	</div>

	<button on:click={handleSubmit}>Submit</button>

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

	<h1>Willkommen zu meinem Svelte Bild</h1>

	<!-- Bild einbinden -->
	<img src="/GeoInfoSim.png" alt="Logo" />

	<p>Dies ist ein Beispiel dafür, wie man ein Bild in Svelte einbindet.</p>
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
