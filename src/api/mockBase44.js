let transactionsDB = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Mock implementation of Base44 API
export const base44 = {
  entities: {
    Transaction: {
      list: async () => {
        await delay(500);
        return [...transactionsDB].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      },

      bulkCreate: async (dataArray) => {
        await delay(500);
        const newTransactions = dataArray.map((data, index) => ({
          id: `${Date.now()}-${index}`,
          created_date: new Date().toISOString(),
          ...data,
        }));
        transactionsDB.push(...newTransactions);
        return newTransactions;
      },

      // ✅ ADD THIS
      clear: async () => {
        await delay(300);
        transactionsDB = [];
        return true;
      }
    }
  },
  // Mock implementation of integrations
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        await delay(1000);
        return { file_url: URL.createObjectURL(file) };
      },

      ExtractDataFromUploadedFile: async ({ file_url }) => {
        await delay(2000);
        try {
          const response = await fetch(file_url);
          const text = await response.text();
          const lines = text.trim().split('\n');
          const headers = lines[0]
            .split(',')
            .map(h => h.trim().toLowerCase());

          const transactions = lines
            .slice(1)
            .map(line => {
              const values = line.split(',');
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = values[index]?.trim();
              });

              const description = obj.description?.toLowerCase() || '';
              let category = 'other';

              if (description.includes('food') || description.includes('restaurant') || description.includes('starbucks')) {
                category = 'food_dining';
              } else if (description.includes('uber') || description.includes('gas') || description.includes('shell')) {
                category = 'transportation';
              } else if (description.includes('amazon') || description.includes('target')) {
                category = 'shopping';
              } else if (description.includes('netflix') || description.includes('spotify')) {
                category = 'subscriptions';
              } else if (description.includes('grocery') || description.includes('whole foods')) {
                category = 'groceries';
              } else if (description.includes('airline') || description.includes('hotel')) {
                category = 'travel';
              } else if (description.includes('salary') || description.includes('deposit')) {
                category = 'income';
              }

              return {
                date: obj.date,
                description: obj.description,
                original_description: obj.description,
                amount: parseFloat(obj.amount),
                category
              };
            })
            .filter(t => t.date && t.description && !isNaN(t.amount));

          return { status: 'success', output: { transactions } };
        } catch (error) {
          return { status: 'error', details: error.message };
        }
      }
    }
  }
};
