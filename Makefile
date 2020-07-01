run:
	deno run --allow-net --allow-env --allow-read --allow-write --allow-plugin --unstable app.ts

denon:
	denon start

fmt:
	deno fmt *.ts