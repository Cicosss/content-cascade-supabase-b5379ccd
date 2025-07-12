import { useState, useEffect } from 'react';
import { POI_TYPE_VALUES, TARGET_AUDIENCE_VALUES } from '@/utils/csvValidationRules';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

export const useSchemaColumns = () => {
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        setError(null);

        // Schema basato sui dati reali da Supabase
        const schemaColumns: ColumnInfo[] = [
          { column_name: 'submitter_email', data_type: 'text', is_nullable: 'NO', column_default: null },
          { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null },
          { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'poi_type', data_type: 'text', is_nullable: 'YES', column_default: "'place'::text" },
          { column_name: 'category', data_type: 'text', is_nullable: 'NO', column_default: "'Ristoranti'::text" },
          { column_name: 'address', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'latitude', data_type: 'numeric', is_nullable: 'YES', column_default: null },
          { column_name: 'longitude', data_type: 'numeric', is_nullable: 'YES', column_default: null },
          { column_name: 'location_name', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'organizer_info', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'price_info', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'duration_info', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'target_audience', data_type: 'text', is_nullable: 'YES', column_default: "'everyone'::text" },
          { column_name: 'phone', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'email', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'website_url', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'start_datetime', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
          { column_name: 'end_datetime', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
          { column_name: 'opening_hours', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'tags', data_type: 'ARRAY', is_nullable: 'YES', column_default: "'{}'::text[]" },
          { column_name: 'images', data_type: 'ARRAY', is_nullable: 'YES', column_default: null },
          { column_name: 'video_url', data_type: 'text', is_nullable: 'YES', column_default: null }
        ];
        
        setColumns(schemaColumns);
      } catch (err) {
        console.error('Error fetching schema:', err);
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  // Escludi colonne automatiche
  const userEditableColumns = columns.filter(col => 
    !['id', 'created_at', 'updated_at', 'moderated_at', 'moderated_by', 'status', 'admin_notes'].includes(col.column_name)
  );

  const requiredColumns = userEditableColumns.filter(col => col.is_nullable === 'NO');
  const optionalColumns = userEditableColumns.filter(col => col.is_nullable === 'YES');

  const generateCsvTemplate = () => {
    const headers = userEditableColumns.map(col => col.column_name);
    const csvContent = headers.join(',') + '\n';
    return csvContent;
  };

  const downloadTemplate = () => {
    const csvContent = generateCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'poi_submissions_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getValidationInfo = () => ({
    officialCategories: OFFICIAL_CATEGORIES,
    poiTypeValues: POI_TYPE_VALUES,
    targetAudienceValues: TARGET_AUDIENCE_VALUES
  });

  return {
    columns: userEditableColumns,
    requiredColumns,
    optionalColumns,
    loading,
    error,
    generateCsvTemplate,
    downloadTemplate,
    getValidationInfo
  };
};