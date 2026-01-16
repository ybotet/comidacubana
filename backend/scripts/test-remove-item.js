const { sequelize, Cart } = require('../src/shared/database/models');

(async () => {
    try {
        await sequelize.authenticate();
        const sessionId = process.argv[2] || '6fec315c-fb85-4d9b-8c10-db08c5553703';
        const cart = await Cart.findOne({ where: { session_id: sessionId } });
        console.log('Initial items:', JSON.stringify(cart.items, null, 2));

        // Ensure an item exists
        if (!cart.items || cart.items.length === 0) {
            cart.items = [{ dish_id: '2d285aad-ac7c-4324-a438-ba614ad43b7b', quantity: 1, added_at: new Date().toISOString() }];
            await cart.calculateTotal();
            cart.set('items', cart.items);
            await cart.save();
            console.log('Added item for test.');
        }

        const afterAdd = await Cart.findOne({ where: { session_id: sessionId } });
        console.log('After add, items:', JSON.stringify(afterAdd.items, null, 2));

        // Remove item index 0
        await cart.removeItem(0);
        console.log('After remove (in-memory):', JSON.stringify(cart.items, null, 2));

        // Save done inside removeItem; reload
        const afterRemove = await Cart.findOne({ where: { session_id: sessionId } });
        console.log('After remove, reloaded items:', JSON.stringify(afterRemove.items, null, 2));

        await sequelize.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
