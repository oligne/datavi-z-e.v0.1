#!/usr/bin/env python3
import pandas as pd
import argparse
import os

def load_data(path):
    """Charge un CSV (sep=';') ou un Excel selon l'extension."""
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.xls', '.xlsx'):
        # pour Excel
        return pd.read_excel(path)
    elif ext == '.csv':
        # pour CSV délimité par un point-virgule
        return pd.read_csv(path, sep=';', encoding='utf-8', on_bad_lines='skip')
    else:
        raise ValueError(f"Format non supporté : {ext}")

def main(input_path, output_path=None):
    # 1) Charger
    df = load_data(input_path)

    # 2) Parser la date et extraire Year-Month
    df['Date de Creation'] = pd.to_datetime(
        df['Date de Creation'], dayfirst=True, errors='coerce'
    )
    df.dropna(subset=['Date de Creation'], inplace=True)
    df['YearMonth'] = df['Date de Creation'].dt.to_period('M').astype(str)

    # 3) Regrouper et compter
    grouped = (
        df.groupby(['Extension', 'YearMonth'])
          .size()
          .reset_index(name='count')
    )

    # 4) 1 point pour 10 fichiers
    grouped['points'] = (grouped['count'] // 10).astype(int)
    summary = grouped.loc[grouped['points'] > 0, [
        'Extension', 'YearMonth', 'count', 'points'
    ]]

    # 5) Afficher
    print(summary.to_string(index=False))

    # 6) Sauvegarde
    if output_path is None:
        output_path = 'analyse_date.csv'
    summary.to_csv(output_path, index=False, sep=';')
    print(f"\nRésumé enregistré dans : {output_path}")

if __name__ == '__main__':
    p = argparse.ArgumentParser(
        description="Analyse data_vie2 (CSV ou XLSX), agrège par mois et extension."
    )
    p.add_argument('input', help="Chemin vers data_vie2.csv ou .xlsx")
    p.add_argument('-o','--output', help="Fichier de sortie (défaut: analyse_date.csv)")
    args = p.parse_args()
    main(args.input, args.output)
