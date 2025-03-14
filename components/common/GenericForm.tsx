// components/GenericForm.tsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GenericFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  children: React.ReactNode;
}

export function GenericForm({
  title,
  onSubmit,
  isSubmitting = false,
  onCancel,
  children
}: GenericFormProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            {onCancel && (
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}