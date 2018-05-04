const { exec } = require("child_process");
const app = new (require("express"))();
const config = require("./config");

app.post("/", async(req, res) => {
	let repo = config.repos.find(r => r.name.toLowerCase() === req.body.repository.name.toLowerCase());
	if (!repo) return;
	require("fs").readDirSync(repo.location).catch(() => console.error(`Warning, repository "${repo.name} has an invalid location."`));
	let result = await exec("git pull", { cwd: repo.location, timeout: 100000 }).catch(() => console.err(`Failed to pull in repository: ${repo.name}`));
	console.log(`Successfully pulled in repository: ${repo.name}${repo.logres ? `\n\n Out:\n${result.stdout}${result.stderr ? `\nError:\n${result.stderr}` : ""}` : ""}`);
});

app.listen(config.port);
