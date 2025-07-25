import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for optimistic UI updates
 * @param {Array} initialData - Initial data array
 * @returns {Object} - Optimistic update state and methods
 */
export const useOptimisticUpdates = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [pendingOperations, setPendingOperations] = useState(new Map());
  const operationIdRef = useRef(0);

  // Generate unique operation ID
  const generateOperationId = () => {
    operationIdRef.current += 1;
    return `op_${operationIdRef.current}_${Date.now()}`;
  };

  // Add optimistic update
  const addOptimisticUpdate = useCallback((item, operation = 'create') => {
    const operationId = generateOperationId();
    
    setData(prevData => {
      switch (operation) {
        case 'create':
          return [...prevData, { ...item, _optimistic: true, _operationId: operationId }];
        case 'update':
          return prevData.map(existingItem => 
            existingItem._id === item._id 
              ? { ...existingItem, ...item, _optimistic: true, _operationId: operationId }
              : existingItem
          );
        case 'delete':
          return prevData.map(existingItem =>
            existingItem._id === item._id
              ? { ...existingItem, _optimistic: true, _operationId: operationId, _deleted: true }
              : existingItem
          );
        default:
          return prevData;
      }
    });

    setPendingOperations(prev => new Map(prev).set(operationId, {
      operation,
      item,
      timestamp: Date.now()
    }));

    return operationId;
  }, []);

  // Confirm optimistic update (remove optimistic flag)
  const confirmOptimisticUpdate = useCallback((operationId, serverResponse = null) => {
    setData(prevData => 
      prevData.map(item => {
        if (item._operationId === operationId) {
          if (item._deleted) {
            return null; // Will be filtered out
          }
          const updatedItem = { ...item };
          delete updatedItem._optimistic;
          delete updatedItem._operationId;
          delete updatedItem._deleted;
          
          // Merge server response if provided
          if (serverResponse) {
            Object.assign(updatedItem, serverResponse);
          }
          
          return updatedItem;
        }
        return item;
      }).filter(Boolean) // Remove null items (deleted)
    );

    setPendingOperations(prev => {
      const newMap = new Map(prev);
      newMap.delete(operationId);
      return newMap;
    });
  }, []);

  // Revert optimistic update (on error)
  const revertOptimisticUpdate = useCallback((operationId) => {
    const operation = pendingOperations.get(operationId);
    
    if (!operation) return;

    setData(prevData => {
      switch (operation.operation) {
        case 'create':
          return prevData.filter(item => item._operationId !== operationId);
        case 'update':
          // Revert to original state - this would need the original item stored
          return prevData.map(item =>
            item._operationId === operationId
              ? operation.originalItem || item
              : item
          );
        case 'delete':
          return prevData.map(item =>
            item._operationId === operationId
              ? { ...item, _optimistic: false, _deleted: false }
              : item
          );
        default:
          return prevData;
      }
    });

    setPendingOperations(prev => {
      const newMap = new Map(prev);
      newMap.delete(operationId);
      return newMap;
    });
  }, [pendingOperations]);

  // Update data from server (sync with server state)
  const syncWithServer = useCallback((serverData) => {
    setData(prevData => {
      // Keep optimistic updates, replace confirmed items
      const optimisticItems = prevData.filter(item => item._optimistic);
      const serverItems = serverData.filter(item => !item._optimistic);
      
      return [...serverItems, ...optimisticItems];
    });
  }, []);

  // Clear all pending operations
  const clearPendingOperations = useCallback(() => {
    setData(prevData => prevData.filter(item => !item._optimistic));
    setPendingOperations(new Map());
  }, []);

  // Get items by status
  const getOptimisticItems = useCallback(() => {
    return data.filter(item => item._optimistic);
  }, [data]);

  const getConfirmedItems = useCallback(() => {
    return data.filter(item => !item._optimistic);
  }, [data]);

  const getPendingItems = useCallback(() => {
    return data.filter(item => item._optimistic && !item._deleted);
  }, [data]);

  const getDeletedItems = useCallback(() => {
    return data.filter(item => item._optimistic && item._deleted);
  }, [data]);

  return {
    // Data
    data,
    setData,
    
    // Optimistic operations
    addOptimisticUpdate,
    confirmOptimisticUpdate,
    revertOptimisticUpdate,
    syncWithServer,
    clearPendingOperations,
    
    // Getters
    getOptimisticItems,
    getConfirmedItems,
    getPendingItems,
    getDeletedItems,
    
    // State
    pendingOperations,
    hasPendingOperations: pendingOperations.size > 0,
    pendingCount: pendingOperations.size
  };
};

export default useOptimisticUpdates;
