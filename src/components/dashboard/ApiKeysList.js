import ApiKeyItem from './ApiKeyItem';

const ApiKeysList = ({ 
  apiKeys, 
  loading, 
  onEdit, 
  onDelete, 
  onCopy 
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Loading API keys...</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 16.5a6 6 0 01-7.743-5.743M15 7a2 2 0 00-2 2m2-2a2 2 0 00-2-2M9 5a2 2 0 012 2m-2-2a2 2 0 00-2 2m2 2L7 9m2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m2-2a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new API key.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-4">
                 {apiKeys.map((apiKey) => (
           <ApiKeyItem
             key={apiKey.id}
             apiKey={apiKey}
             onEdit={onEdit}
             onDelete={onDelete}
             onCopy={onCopy}
           />
         ))}
      </div>
    </div>
  );
};

export default ApiKeysList;
