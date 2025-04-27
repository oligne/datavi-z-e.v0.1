import pandas as pd

# === PARAMÈTRES ===
input_csv = "/Users/mac/Desktop/ENSAAMA1.0/06_CODE/04DATAVIZ/assets/data_vie2.csv"
output_csv = "/Users/mac/Desktop/ENSAAMA1.0/06_CODE/04DATAVIZ/analyse_poids.csv"
delimiter = ";"  # Adapté si besoin

# === CHARGEMENT DU CSV ===
df = pd.read_csv(input_csv, sep=delimiter, encoding="utf-8")

# === NORMALISATION DES DONNÉES ===
# S'assurer que les extensions sont en minuscules (optionnel mais conseillé)
df["Extension"] = df["Extension"].astype(str).str.strip().str.lower()

# Supprimer les lignes sans taille ou extension
df = df.dropna(subset=["Extension", "Taille2"])

# Convertir les tailles en numérique
df["Taille2"] = pd.to_numeric(df["Taille2"], errors="coerce")
df = df.dropna(subset=["Taille2"])

# === ANALYSE PAR EXTENSION ===
# Groupement par extension
grouped = df.groupby("Extension").agg(
    Nb_fichiers=("Extension", "count"),
    Taille_totale_ko=("Taille2", "sum"),
    Taille_moyenne_ko=("Taille2", "mean")
).reset_index()

# Totaux globaux
total_fichiers = grouped["Nb_fichiers"].sum()
total_poids = grouped["Taille_totale_ko"].sum()

# Ajouter les pourcentages
grouped["%_fichiers"] = (grouped["Nb_fichiers"] / total_fichiers * 100).round(2)
grouped["%_poids"] = (grouped["Taille_totale_ko"] / total_poids * 100).round(2)

# Réorganisation des colonnes pour lisibilité
cols = ["Extension", "Nb_fichiers", "%_fichiers", "Taille_totale_ko", "%_poids", "Taille_moyenne_ko"]
grouped = grouped[cols].sort_values(by="Taille_totale_ko", ascending=False)

# === EXPORT CSV ===
grouped.to_csv(output_csv, index=False, sep=";")
print(f"✅ Analyse exportée vers : {output_csv}")
