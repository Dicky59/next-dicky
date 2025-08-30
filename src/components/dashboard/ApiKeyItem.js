import { copyToClipboard } from '@/utils/clipboard';

const ApiKeyItem = ({ 
  apiKey, 
  onEdit, 
  onDelete, 
  onCopy 
}) => {
  const handleCopy = async () => {
    const result = await copyToClipboard(apiKey.key);
    if (result.success && onCopy) {
      onCopy();
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {apiKey.name}
            </h4>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {apiKey.description}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
            <span>Last used: {apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}</span>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono">
              {apiKey.key}
            </code>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(apiKey)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(apiKey)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyItem;
