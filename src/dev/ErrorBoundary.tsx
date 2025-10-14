import React from 'react';
import { View, Text } from 'react-native';

export class ErrorBoundary extends React.Component<{children: React.ReactNode},{e?: any}> {
  state = { e: undefined as any };
  componentDidCatch(e: any) { this.setState({ e }); console.error(e); }
  render() {
    if (!this.state.e) return this.props.children;
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:24}}>
        <Text style={{color:'crimson',fontWeight:'600'}}>JS error:</Text>
        <Text selectable style={{marginTop:8}}>{String(this.state.e)}</Text>
      </View>
    );
  }
}