import express, { Request, Response } from "express";
import cors from "cors";
import Datas from "./datas.json";

const app = express();
const PORT = 3000;

// Définition des options CORS
const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
	res.status(200).json({ message: "Hello World" });
});

app.get("/api/items", (req: Request, res: Response): void => {
	if (!Datas || Datas.length === 0) {
		res.status(404).json({ message: "Aucune donnée disponible" });
		return;
	}
	res.status(200).json(Datas);
});

app.get("/api/items/:id([0-9]+)", (req: Request, res: Response): void => {
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

// Démarrer le serveur
app.listen(PORT, () => {
	console.log(`🚀 Serveur prêt sur http://localhost:${PORT} ⭐️`);
});

export default app;
