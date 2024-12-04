import express, { Request, Response } from "express";
import path from "node:path";
import cors from "cors";
import Datas from "./datas.json";

const app = express();
const PORT = 3000;

// Définition des options CORS
const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200,
};

app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
	res.send(`
    <h1>API Documentation</h1>
    <ul>
      <li><strong>GET /</strong>: Returns this API documentation.</li>
      <li><strong>GET /api/resources</strong>: Returns all resources.</li>
      <li><strong>GET /api/resources/:id</strong>: Returns a resource by ID.</li>
      <li><strong>GET /api/resources/available</strong>: Returns all available resources.</li>
      <li><strong>GET /api/resources/category/:categorie</strong>: Returns resources by category.</li>
      <li><strong>GET /api/resources/location/:city</strong>: Returns resources by location.</li>
	  <li>
		<a href="https://github.com/GorskiAnthony/api-re-connect" target="_blank">Lien Github</a>
	  </li>
    </ul>
  `);
});

app.get("/api/resources", (req: Request, res: Response): void => {
	if (!Datas || Datas.length === 0) {
		res.status(404).json({ message: "Aucune donnée disponible" });
		return;
	}
	res.status(200).json(Datas);
});

app.get("/api/resources/:id([0-9]+)", (req: Request, res: Response): void => {
	const id = parseInt(req.params.id);

	if (!Datas || Datas.length === 0) {
		res.status(404).json({ message: "Aucune donnée disponible" });
		return;
	}

	if (isNaN(id) || id <= 0) {
		res.status(400).json({ message: "ID invalide" });
		return;
	}

	const item = Datas.find((data: any) => data.id === id);
	if (!item) {
		res.status(404).json({ message: `Aucun item trouvé pour l'ID ${id}` });
		return;
	}

	res.status(200).json(item);
});

app.get(
	"/api/resources/location/:city",
	(req: Request, res: Response): void => {
		const city = req.params.city;

		if (!Datas || Datas.length === 0) {
			res.status(404).json({ message: "Aucune donnée disponible" });
			return;
		}

		const items = Datas.filter(
			(data: any) =>
				data.localisation.toLowerCase() === city.toLowerCase()
		);
		if (!items || items.length === 0) {
			res.status(404).json({
				message: `Aucun item trouvé pour la ville ${city}`,
			});
			return;
		}

		res.status(200).json(items);
	}
);

app.get("/api/resources/available", (req: Request, res: Response): void => {
	if (!Datas || Datas.length === 0) {
		res.status(404).json({ message: "Aucune donnée disponible" });
		return;
	}

	const items = Datas.filter((data: any) => data.disponibilite === true);
	if (!items || items.length === 0) {
		res.status(404).json({
			message: `Aucun item disponible`,
		});
		return;
	}

	res.status(200).json(items);
});

app.get(
	"/api/resources/category/:categorie",
	(req: Request, res: Response): void => {
		const categorie = req.params.categorie;

		if (!Datas || Datas.length === 0) {
			res.status(404).json({ message: "Aucune donnée disponible" });
			return;
		}

		const items = Datas.filter(
			(data: any) =>
				data.categorie.toLowerCase() === categorie.toLowerCase()
		);
		if (!items || items.length === 0) {
			res.status(404).json({
				message: `Aucun item trouvé pour la catégorie ${categorie}`,
			});
			return;
		}

		res.status(200).json(items);
	}
);

// Démarrer le serveur
app.listen(PORT, () => {
	console.log(`🚀 Serveur prêt sur http://localhost:${PORT} ⭐️`);
});

export default app;
