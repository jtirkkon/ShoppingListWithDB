import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, product text, amount text);');
    });
    updateList();    
  }, []);

  const saveProduct = () => {
    db.transaction(tx => {
        tx.executeSql('insert into product (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    );
    setProduct('');
    setAmount('');
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      ); 
    });
  }

  const deleteProduct = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from product where id = ?;`, [id]);
      }, null, updateList
    );    
  }
  
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInputStyle} onChangeText={text => setProduct(text)} value={product} placeholder='Product'></TextInput>
      <TextInput style={styles.textInputStyle} onChangeText={text => setAmount(text)} value={amount} placeholder='amount'></TextInput>
      <Button title="SAVE" onPress={saveProduct}></Button>
      <Text style={styles.shoppingListStyle}>Shopping List</Text>
      <FlatList 
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => 
        <View style={styles.listcontainer}>
          <Text>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteProduct(item.id)}> bought</Text>
        </View>} 
        data={shoppingList} 
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  textInputStyle: {
    width: 200,
    minHeight: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
  },
  shoppingListStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#00008B',
    marginTop: 10  
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});

